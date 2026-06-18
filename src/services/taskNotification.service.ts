import { doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import {
  notificationDocument,
  notificationsCollection,
  serverTimestamp,
} from '../firebase/firestore';
import type { AppNotificationItem } from '../hooks/useNotificationStore';
import type { Task } from '../types/task.types';
import type {
  FirestoreNotificationDocument,
  TaskNotificationEventType,
  TaskNotificationPayload,
} from '../types/notification.types';
import { logError } from '../utils/errorLogger';
import { stripUndefined } from '../utils/firestoreHelpers';

type BuildNotificationsInput = {
  type: TaskNotificationEventType;
  task: Task;
  actorUid: string;
  actorName: string;
};

const isPermissionDenied = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  return code === 'firestore/permission-denied';
};

const buildTaskNotifications = ({
  type,
  task,
  actorUid,
  actorName,
}: BuildNotificationsInput): TaskNotificationPayload[] => {
  const title = task.title.trim();
  const ownerId = task.ownerId;
  const workerId = task.workerId;
  const workerName = task.workerName ?? actorName;
  const ownerName = task.ownerName;
  const isOwnerActor = actorUid === ownerId;
  const isWorkerActor = Boolean(workerId && actorUid === workerId);

  const forOwner = (notificationTitle: string, body: string): TaskNotificationPayload => ({
    userId: ownerId,
    title: notificationTitle,
    body,
  });

  const forWorker = (notificationTitle: string, body: string): TaskNotificationPayload | null => {
    if (!workerId) {
      return null;
    }
    return {
      userId: workerId,
      title: notificationTitle,
      body,
    };
  };

  switch (type) {
    case 'task_posted':
      return [
        forOwner(
          'Task posted',
          `Your task "${title}" is now open for workers nearby.`,
        ),
      ];

    case 'task_accepted':
      return [
        forOwner(
          'Task accepted',
          `${workerName} accepted your task "${title}".`,
        ),
        forWorker(
          'You accepted a task',
          `You accepted "${title}" posted by ${ownerName}.`,
        ),
      ].filter((item): item is TaskNotificationPayload => item !== null);

    case 'task_started':
      return [
        forOwner(
          'Task in progress',
          isWorkerActor
            ? `${actorName} started working on "${title}".`
            : `"${title}" is now in progress.`,
        ),
        forWorker(
          'Task started',
          isWorkerActor
            ? `You started working on "${title}".`
            : `"${title}" is now in progress.`,
        ),
      ].filter((item): item is TaskNotificationPayload => item !== null);

    case 'task_completed':
      return [
        forOwner(
          'Task completed',
          `"${title}" was marked as completed${isWorkerActor ? ` by ${actorName}` : ''}.`,
        ),
        forWorker(
          'Task completed',
          isOwnerActor
            ? `${ownerName} marked "${title}" as completed.`
            : `You marked "${title}" as completed.`,
        ),
      ].filter((item): item is TaskNotificationPayload => item !== null);

    case 'task_cancelled':
      return [
        forOwner(
          'Task cancelled',
          isOwnerActor
            ? `You cancelled "${title}".`
            : `${actorName} cancelled "${title}".`,
        ),
        forWorker(
          'Task cancelled',
          isOwnerActor
            ? `${ownerName} cancelled "${title}".`
            : `You cancelled "${title}".`,
        ),
      ].filter((item): item is TaskNotificationPayload => item !== null);

    case 'acceptance_cancelled':
      return [
        forOwner(
          'Acceptance cancelled',
          isWorkerActor
            ? `${actorName} stopped working on "${title}". The task is open again.`
            : `"${title}" is open again.`,
        ),
        forWorker(
          'Acceptance cancelled',
          isWorkerActor
            ? `You cancelled your acceptance of "${title}".`
            : `Acceptance for "${title}" was cancelled.`,
        ),
      ].filter((item): item is TaskNotificationPayload => item !== null);

    case 'task_deleted':
      return [
        forOwner(
          'Task deleted',
          `You removed "${title}" from the marketplace.`,
        ),
      ];

    default:
      return [];
  }
};

export const sendTaskNotifications = async ({
  type,
  task,
  actorUid,
  actorName,
}: BuildNotificationsInput): Promise<void> => {
  const payloads = buildTaskNotifications({ type, task, actorUid, actorName });
  if (payloads.length === 0) {
    return;
  }

  await Promise.all(
    payloads.map(async payload => {
      const notificationRef = doc(notificationsCollection());
      const notificationId = notificationRef.id;
      const document = stripUndefined({
        notificationId,
        userId: payload.userId,
        taskId: task.id,
        eventType: type,
        title: payload.title,
        body: payload.body,
        actorUid,
        actorName: actorName.trim(),
        read: false,
        createdAt: serverTimestamp(),
      }) as FirestoreNotificationDocument;

      await setDoc(notificationRef, document);
    }),
  );
};

export const dispatchTaskNotifications = (
  type: TaskNotificationEventType,
  task: Task,
  actorUid: string,
  actorName: string,
): void => {
  void sendTaskNotifications({ type, task, actorUid, actorName }).catch(error => {
    logError('TaskNotification.dispatch', error, { type, taskId: task.id, actorUid });
  });
};

const timestampToMillis = (
  value?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null,
): number | undefined => {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return value.toDate().getTime();
  }
  return undefined;
};

export const mapFirestoreNotification = (
  id: string,
  data: FirebaseFirestoreTypes.DocumentData | undefined,
): AppNotificationItem | null => {
  if (!data) {
    return null;
  }

  const docData = data as FirestoreNotificationDocument;

  return {
    id,
    title: docData.title,
    body: docData.body,
    type: 'task',
    taskId: docData.taskId,
    eventType: docData.eventType,
    createdAt: timestampToMillis(docData.createdAt) ?? Date.now(),
    readAt: timestampToMillis(docData.readAt),
    read: Boolean(docData.read),
  };
};

export const subscribeToUserNotifications = (
  userId: string,
  onNext: (notifications: AppNotificationItem[]) => void,
  onError?: (error: Error) => void,
) => {
  return onSnapshot(
    query(notificationsCollection(), where('userId', '==', userId)),
    snapshot => {
      const notifications = snapshot.docs
        .map(docSnap => mapFirestoreNotification(docSnap.id, docSnap.data()))
        .filter((item): item is AppNotificationItem => item !== null)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 50);
      onNext(notifications);
    },
    error => onError?.(error),
  );
};

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  const snapshot = await getDocs(query(notificationsCollection(), where('userId', '==', userId)));
  return snapshot.docs.filter(docSnap => !docSnap.data()?.read).length;
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
): Promise<void> => {
  try {
    const snapshot = await getDoc(notificationDocument(notificationId));
    if (!snapshot.exists()) {
      return;
    }

    const data = snapshot.data() as FirestoreNotificationDocument;
    if (data.userId !== userId || data.read) {
      return;
    }

    await updateDoc(snapshot.ref, {
      read: true,
      readAt: serverTimestamp(),
    });
  } catch (error) {
    if (isPermissionDenied(error)) {
      return;
    }
    throw error;
  }
};

export const markAllUserNotificationsRead = async (userId: string): Promise<void> => {
  const snapshot = await getDocs(query(notificationsCollection(), where('userId', '==', userId)));
  const unread = snapshot.docs.filter(docSnap => !docSnap.data()?.read);

  await Promise.all(
    unread.map(docSnap =>
      updateDoc(docSnap.ref, {
        read: true,
        readAt: serverTimestamp(),
      }),
    ),
  );
};
