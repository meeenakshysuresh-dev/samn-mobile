import { collection, doc, getFirestore, serverTimestamp } from '@react-native-firebase/firestore';

import { FIRESTORE_COLLECTIONS } from './config';

export { serverTimestamp };

const db = () => getFirestore();

export const userDocument = (uid: string) => doc(db(), FIRESTORE_COLLECTIONS.users, uid);

export const tasksCollection = () => collection(db(), FIRESTORE_COLLECTIONS.tasks);

export const taskDocument = (taskId: string) => doc(db(), FIRESTORE_COLLECTIONS.tasks, taskId);

export const notificationsCollection = () =>
  collection(db(), FIRESTORE_COLLECTIONS.notifications);

export const notificationDocument = (notificationId: string) =>
  doc(db(), FIRESTORE_COLLECTIONS.notifications, notificationId);
