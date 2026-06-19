import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { ChatRoomStatus } from './chat.types';
import type { MessageType } from './message.types';
import type { TaskStatus } from './task.types';

export type FirestoreChatRoomDocument = {
  chatRoomId: string;
  taskId: string;
  ownerUid: string;
  workerUid: string;
  participants: string[];
  taskTitle: string;
  taskStatus: TaskStatus;
  ownerName: string;
  workerName: string;
  ownerPhotoUrl?: string;
  workerPhotoUrl?: string;
  lastMessage: string;
  lastMessageAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  lastMessageSenderId: string;
  unreadCounts: Record<string, number>;
  status: ChatRoomStatus;
  createdAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  updatedAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
};

export type FirestoreMessageDocument = {
  messageId: string;
  chatRoomId: string;
  senderUid: string;
  receiverUid: string;
  message: string;
  messageType: MessageType;
  createdAt?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null;
  isRead: boolean;
  isDelivered: boolean;
};
