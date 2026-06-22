import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { FirestoreTaskDocument } from '../types/task.firestore.types';
import type { Task, TaskStatus, TaskTimelineEvent } from '../types/task.types';
import { buildPostedDateLabel } from './taskWorkflow';

export const normalizeTaskStatus = (value: unknown): TaskStatus => {
  const raw = String(value ?? 'open')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  if (raw === 'in_progress' || raw === 'inprogress') {
    return 'in_progress';
  }
  if (raw === 'accepted') {
    return 'accepted';
  }
  if (raw === 'completed') {
    return 'completed';
  }
  if (raw === 'cancelled' || raw === 'canceled') {
    return 'cancelled';
  }
  return 'open';
};

export const formatFirestoreTimestamp = (
  value?: FirebaseFirestoreTypes.Timestamp | null,
): string => {
  if (!value || typeof value.toDate !== 'function') {
    return '';
  }
  return value.toDate().toLocaleString();
};

export const timestampToIso = (
  value?: FirebaseFirestoreTypes.Timestamp | null,
): string => {
  if (!value || typeof value.toDate !== 'function') {
    return new Date().toISOString();
  }
  return value.toDate().toISOString();
};

export const buildTimelineFromFirestore = (doc: FirestoreTaskDocument): TaskTimelineEvent[] => {
  const events: TaskTimelineEvent[] = [];

  if (doc.createdAt) {
    events.push({
      id: `${doc.taskId}-open`,
      status: 'open',
      label: 'Task posted',
      timestamp: formatFirestoreTimestamp(doc.createdAt as FirebaseFirestoreTypes.Timestamp),
      actorName: doc.ownerName,
    });
  }

  if (doc.acceptedAt) {
    events.push({
      id: `${doc.taskId}-accepted`,
      status: 'accepted',
      label: 'Task accepted',
      timestamp: formatFirestoreTimestamp(doc.acceptedAt as FirebaseFirestoreTypes.Timestamp),
      actorName: doc.acceptedByName ?? undefined,
    });
  }

  const status = normalizeTaskStatus(doc.status);

  if (status === 'in_progress' || status === 'completed') {
    events.push({
      id: `${doc.taskId}-progress`,
      status: 'in_progress',
      label: 'Task started',
      timestamp: formatFirestoreTimestamp(doc.updatedAt as FirebaseFirestoreTypes.Timestamp),
      actorName: doc.acceptedByName ?? undefined,
    });
  }

  if (doc.completedAt) {
    events.push({
      id: `${doc.taskId}-completed`,
      status: 'completed',
      label: 'Task completed',
      timestamp: formatFirestoreTimestamp(doc.completedAt as FirebaseFirestoreTypes.Timestamp),
      actorName: doc.acceptedByName ?? doc.ownerName,
    });
  }

  if (doc.cancelledAt) {
    events.push({
      id: `${doc.taskId}-cancelled`,
      status: 'cancelled',
      label: 'Task cancelled',
      timestamp: formatFirestoreTimestamp(doc.cancelledAt as FirebaseFirestoreTypes.Timestamp),
      actorName: doc.ownerName,
    });
  }

  return events;
};

export const mapFirestoreTaskDocument = (
  id: string,
  data: FirebaseFirestoreTypes.DocumentData | undefined,
): Task | null => {
  if (!data) {
    return null;
  }

  const doc = data as FirestoreTaskDocument & { taskName?: string; name?: string };
  const createdAt = timestampToIso(doc.createdAt as FirebaseFirestoreTypes.Timestamp);
  const status = normalizeTaskStatus(doc.status);
  const title = String(doc.title ?? doc.taskName ?? doc.name ?? '').trim();

  return {
    id: doc.taskId || id,
    title,
    category: doc.category,
    description: doc.description ?? '',
    location: doc.location ?? '',
    budget: Number(doc.budget ?? 0),
    preferredDateTime: doc.preferredDateTime ?? '',
    priority: doc.priority ?? 'medium',
    status,
    postedDate: buildPostedDateLabel(createdAt),
    createdAt,
    ownerId: doc.ownerUid,
    ownerName: doc.ownerName ?? '',
    workerId: doc.acceptedBy ?? undefined,
    workerName: doc.acceptedByName ?? undefined,
    images: [],
    timeline: buildTimelineFromFirestore({ ...doc, taskId: doc.taskId || id, status }),
  };
};

export const mergeTaskLists = (...lists: Task[][]): Task[] => {
  const byId = new Map<string, Task>();
  lists.flat().forEach(task => {
    byId.set(task.id, task);
  });

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
