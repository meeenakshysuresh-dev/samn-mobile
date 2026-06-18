import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type TaskNotificationEventType =
  | 'task_posted'
  | 'task_accepted'
  | 'task_started'
  | 'task_completed'
  | 'task_cancelled'
  | 'task_deleted'
  | 'acceptance_cancelled';

export type FirestoreNotificationDocument = {
  notificationId: string;
  userId: string;
  taskId: string;
  eventType: TaskNotificationEventType;
  title: string;
  body: string;
  actorUid: string;
  actorName: string;
  read: boolean;
  readAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  createdAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
};

export type TaskNotificationPayload = {
  userId: string;
  title: string;
  body: string;
};
