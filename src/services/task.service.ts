import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { serverTimestamp, taskDocument, tasksCollection } from '../firebase/firestore';
import { getCurrentUser } from '../firebase/auth';
import type { FirestoreTaskDocument, TaskSubscriptionSlices } from '../types/task.firestore.types';
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from '../types/task.types';
import { mapFirestoreTaskDocument, mergeTaskLists, normalizeTaskStatus } from '../utils/taskMapper';
import { logError } from '../utils/errorLogger';
import { dispatchTaskNotifications } from './taskNotification.service';
import { canAcceptTask, canCancelAcceptance, canCancelTask, canCompleteTask, canDeleteTask, canEditTask, canStartTask } from '../utils/taskWorkflow';

const OPEN_TASKS_LIMIT = 50;
const POSTED_TASKS_LIMIT = 100;
const ACCEPTED_TASKS_LIMIT = 100;

export class TaskServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskServiceError';
  }
}

const isPermissionDenied = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  return code === 'firestore/permission-denied';
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof TaskServiceError) {
    return error.message;
  }
  if (isPermissionDenied(error)) {
    return 'Permission denied. Deploy the Firestore rules in firestore.rules to your Firebase project (samn-mobile).';
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const failTask = (error: unknown, fallback: string, action: string): never => {
  logError('TaskService', error, { action }, fallback);
  throw new TaskServiceError(getErrorMessage(error, fallback));
};

const requireAuthUid = (): string => {
  const uid = getCurrentUser()?.uid;
  if (!uid) {
    throw new TaskServiceError('You must be signed in to perform this action.');
  }
  return uid;
};

const getTimestampMillis = (
  data: FirebaseFirestoreTypes.DocumentData | undefined,
  field: 'createdAt' | 'updatedAt',
): number => {
  const value = data?.[field];
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().getTime();
  }
  return 0;
};

const mapAndSortSnapshot = (
  snapshot: {
    docs: ReadonlyArray<{ id: string; data: () => FirebaseFirestoreTypes.DocumentData | undefined }>;
  },
  sortField: 'createdAt' | 'updatedAt',
  maxResults: number,
): Task[] => {
  const tasks = snapshot.docs
    .map(docSnap => ({
      task: mapFirestoreTaskDocument(docSnap.id, docSnap.data()),
      sortTime: getTimestampMillis(docSnap.data(), sortField),
    }))
    .filter((item): item is { task: Task; sortTime: number } => item.task !== null)
    .sort((a, b) => {
      const aTime = a.sortTime || new Date(a.task.createdAt).getTime();
      const bTime = b.sortTime || new Date(b.task.createdAt).getTime();
      return bTime - aTime;
    })
    .slice(0, maxResults)
    .map(item => item.task);

  return tasks;
};

const allTasksQuery = () => query(tasksCollection());

const sliceTasksForUser = (allTasks: Task[], userId: string): TaskSubscriptionSlices => ({
  openTasks: allTasks.filter(task => task.status === 'open').slice(0, OPEN_TASKS_LIMIT),
  postedTasks: allTasks.filter(task => task.ownerId === userId).slice(0, POSTED_TASKS_LIMIT),
  acceptedTasks: allTasks
    .filter(task => task.workerId === userId && task.ownerId !== userId)
    .slice(0, ACCEPTED_TASKS_LIMIT),
});

const getTaskOrThrow = async (taskId: string): Promise<Task> => {
  const snapshot = await getDoc(taskDocument(taskId));
  if (!snapshot.exists()) {
    throw new TaskServiceError('Task not found.');
  }

  const task = mapFirestoreTaskDocument(snapshot.id, snapshot.data());
  if (!task) {
    throw new TaskServiceError('Task data is invalid.');
  }

  return task;
};

const assertTransition = (currentStatus: TaskStatus, nextStatus: TaskStatus) => {
  const allowed: Record<TaskStatus, TaskStatus[]> = {
    open: ['accepted', 'cancelled'],
    accepted: ['in_progress', 'cancelled', 'open'],
    in_progress: ['completed'],
    completed: [],
    cancelled: [],
  };

  if (!allowed[currentStatus]?.includes(nextStatus)) {
    throw new TaskServiceError(`Cannot change task status from ${currentStatus} to ${nextStatus}.`);
  }
};

export const fetchTasksForUser = async (userId: string): Promise<TaskSubscriptionSlices> => {
  try {
    const snapshot = await getDocs(allTasksQuery());
    const allTasks = mapAndSortSnapshot(snapshot, 'createdAt', 500);
    return sliceTasksForUser(allTasks, userId);
  } catch (error) {
    return failTask(error, 'Failed to load tasks.', 'fetchTasksForUser');
  }
};

export const subscribeToTasksForUser = (
  userId: string,
  onNext: (slices: TaskSubscriptionSlices) => void,
  onError?: (error: Error) => void,
) => {
  const handleError = (error: Error) => {
    logError('TaskService.subscribe', error, { userId });
    if (isPermissionDenied(error)) {
      onError?.(new TaskServiceError('You do not have permission to view tasks.'));
      return;
    }
    onError?.(error);
  };

  return onSnapshot(
    allTasksQuery(),
    snapshot => {
      const allTasks = mapAndSortSnapshot(snapshot, 'createdAt', 500);
      onNext(sliceTasksForUser(allTasks, userId));
    },
    handleError,
  );
};

export const createTask = async (
  input: CreateTaskInput,
  ownerUid: string,
  ownerName: string,
): Promise<Task> => {
  const authUid = requireAuthUid();
  if (ownerUid !== authUid) {
    throw new TaskServiceError('Task owner does not match the signed-in user.');
  }

  const taskRef = doc(tasksCollection());
  const taskId = taskRef.id;
  const trimmedOwnerName = ownerName.trim() || getCurrentUser()?.displayName?.trim() || 'User';

  const payload: FirestoreTaskDocument = {
    taskId,
    ownerUid: authUid,
    ownerName: trimmedOwnerName,
    title: input.title.trim(),
    category: input.category,
    description: input.description.trim(),
    location: input.location.trim(),
    budget: input.budget,
    preferredDateTime: input.preferredDateTime.trim(),
    priority: input.priority,
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(taskRef, payload);
    const task = await getTaskOrThrow(taskId);
    dispatchTaskNotifications('task_posted', task, authUid, trimmedOwnerName);
    return task;
  } catch (error) {
    return failTask(error, 'Failed to post task.', 'createTask');
  }
};

export const updateTask = async (taskId: string, userId: string, input: UpdateTaskInput): Promise<Task> => {
  const existing = await getTaskOrThrow(taskId);

  if (!canEditTask(existing, userId)) {
    throw new TaskServiceError('Only open tasks can be edited.');
  }

  const updates: Partial<FirestoreTaskDocument> = {
    updatedAt: serverTimestamp(),
  };

  if (input.title !== undefined) {
    updates.title = input.title.trim();
  }
  if (input.category !== undefined) {
    updates.category = input.category;
  }
  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }
  if (input.location !== undefined) {
    updates.location = input.location.trim();
  }
  if (input.budget !== undefined) {
    updates.budget = input.budget;
  }
  if (input.preferredDateTime !== undefined) {
    updates.preferredDateTime = input.preferredDateTime.trim();
  }
  if (input.priority !== undefined) {
    updates.priority = input.priority;
  }

  try {
    await updateDoc(taskDocument(taskId), updates);
    return getTaskOrThrow(taskId);
  } catch (error) {
    return failTask(error, 'Failed to update task.', 'updateTask');
  }
};

export const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  const existing = await getTaskOrThrow(taskId);

  if (!canDeleteTask(existing, userId)) {
    throw new TaskServiceError('Only open tasks can be deleted.');
  }

  try {
    await deleteDoc(taskDocument(taskId));
    dispatchTaskNotifications('task_deleted', existing, userId, existing.ownerName);
  } catch (error) {
    return failTask(error, 'Failed to delete task.', 'deleteTask');
  }
};

export const acceptTask = async (
  taskId: string,
  workerUid: string,
  workerName: string,
): Promise<Task> => {
  const existing = await getTaskOrThrow(taskId);

  if (!canAcceptTask(existing, workerUid)) {
    throw new TaskServiceError('You cannot accept this task.');
  }

  assertTransition(normalizeTaskStatus(existing.status), 'accepted');

  try {
    await updateDoc(taskDocument(taskId), {
      status: 'accepted',
      acceptedBy: workerUid,
      acceptedByName: workerName.trim(),
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const task = await getTaskOrThrow(taskId);
    dispatchTaskNotifications('task_accepted', task, workerUid, workerName.trim());
    return task;
  } catch (error) {
    return failTask(error, 'Failed to accept task.', 'acceptTask');
  }
};

export const startTask = async (taskId: string, userId: string, actorName: string): Promise<Task> => {
  const existing = await getTaskOrThrow(taskId);

  if (!canStartTask(existing, userId)) {
    throw new TaskServiceError('You cannot start this task.');
  }

  assertTransition(normalizeTaskStatus(existing.status), 'in_progress');

  try {
    await updateDoc(taskDocument(taskId), {
      status: 'in_progress',
      updatedAt: serverTimestamp(),
    });
    const task = await getTaskOrThrow(taskId);
    dispatchTaskNotifications('task_started', task, userId, actorName);
    return task;
  } catch (error) {
    return failTask(error, 'Failed to start task.', 'startTask');
  }
};

export const completeTask = async (taskId: string, userId: string, actorName: string): Promise<Task> => {
  const existing = await getTaskOrThrow(taskId);

  if (!canCompleteTask(existing, userId)) {
    throw new TaskServiceError('You cannot complete this task.');
  }

  assertTransition(normalizeTaskStatus(existing.status), 'completed');

  try {
    await updateDoc(taskDocument(taskId), {
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const task = await getTaskOrThrow(taskId);
    dispatchTaskNotifications('task_completed', task, userId, actorName);
    return task;
  } catch (error) {
    return failTask(error, 'Failed to complete task.', 'completeTask');
  }
};

export const cancelTask = async (taskId: string, userId: string, actorName: string): Promise<Task> => {
  const existing = await getTaskOrThrow(taskId);

  if (!canCancelTask(existing, userId)) {
    throw new TaskServiceError('You cannot cancel this task.');
  }

  assertTransition(normalizeTaskStatus(existing.status), 'cancelled');

  try {
    await updateDoc(taskDocument(taskId), {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const task = await getTaskOrThrow(taskId);
    dispatchTaskNotifications('task_cancelled', task, userId, actorName);
    return task;
  } catch (error) {
    return failTask(error, 'Failed to cancel task.', 'cancelTask');
  }
};

export const cancelAcceptance = async (taskId: string, userId: string, actorName: string): Promise<Task> => {
  const existing = await getTaskOrThrow(taskId);

  if (!canCancelAcceptance(existing, userId)) {
    throw new TaskServiceError('You cannot cancel acceptance for this task.');
  }

  assertTransition(normalizeTaskStatus(existing.status), 'open');

  try {
    await updateDoc(taskDocument(taskId), {
      status: 'open',
      acceptedBy: deleteField(),
      acceptedByName: deleteField(),
      acceptedAt: deleteField(),
      updatedAt: serverTimestamp(),
    });
    const reopenedTask = await getTaskOrThrow(taskId);
    dispatchTaskNotifications(
      'acceptance_cancelled',
      { ...existing, status: 'open', workerId: existing.workerId, workerName: existing.workerName },
      userId,
      actorName,
    );
    return reopenedTask;
  } catch (error) {
    return failTask(error, 'Failed to cancel acceptance.', 'cancelAcceptance');
  }
};

export { mergeTaskLists, getErrorMessage as getTaskServiceErrorMessage };
