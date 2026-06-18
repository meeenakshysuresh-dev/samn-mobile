import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { TaskCategory, TaskPriority, TaskStatus } from './task.types';

export type FirestoreTaskDocument = {
  taskId: string;
  ownerUid: string;
  ownerName: string;
  acceptedBy?: string | null;
  acceptedByName?: string | null;
  title: string;
  category: TaskCategory;
  description: string;
  budget: number;
  location: string;
  preferredDateTime: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  updatedAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  acceptedAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  completedAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  cancelledAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
};

export type TaskSubscriptionSlices = {
  openTasks: import('./task.types').Task[];
  postedTasks: import('./task.types').Task[];
  acceptedTasks: import('./task.types').Task[];
};
