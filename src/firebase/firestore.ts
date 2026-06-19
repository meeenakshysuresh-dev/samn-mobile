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

/** Chat metadata: tasks/{taskId}/chat/meta */
export const taskChatMetaDocument = (taskId: string) =>
  doc(db(), FIRESTORE_COLLECTIONS.tasks, taskId, 'chat', 'meta');

/** Messages: tasks/{taskId}/messages/{messageId} (sibling of chat/, not under chat/) */
export const taskChatMessagesCollection = (taskId: string) =>
  collection(db(), FIRESTORE_COLLECTIONS.tasks, taskId, 'messages');

export const taskChatMessageDocument = (taskId: string, messageId: string) =>
  doc(db(), FIRESTORE_COLLECTIONS.tasks, taskId, 'messages', messageId);

/** chatRoomId is always the taskId */
export const chatRoomDocument = (chatRoomId: string) => taskChatMetaDocument(chatRoomId);

export const chatMessagesCollection = (chatRoomId: string) =>
  taskChatMessagesCollection(chatRoomId);

export const chatMessageDocument = (chatRoomId: string, messageId: string) =>
  taskChatMessageDocument(chatRoomId, messageId);
