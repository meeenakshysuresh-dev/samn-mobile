import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import type { ChatListItem, ChatRoom } from '../types/chat.types';
import type { FirestoreChatRoomDocument } from '../types/chat.firestore.types';
import type { FirestoreMessageDocument } from '../types/chat.firestore.types';
import type { ChatMessage } from '../types/message.types';
import type { TaskStatus, Task } from '../types/task.types';

const timestampToMillis = (
  value?: FirebaseFirestoreTypes.Timestamp | FirebaseFirestoreTypes.FieldValue | null,
): number => {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return value.toDate().getTime();
  }
  return Date.now();
};

export const mapFirestoreChatRoom = (
  id: string,
  data: FirebaseFirestoreTypes.DocumentData | undefined,
): ChatRoom | null => {
  if (!data) {
    return null;
  }

  const doc = data as FirestoreChatRoomDocument;

  return {
    chatRoomId: doc.chatRoomId ?? id,
    taskId: doc.taskId,
    ownerUid: doc.ownerUid,
    workerUid: doc.workerUid,
    participants: Array.isArray(doc.participants) ? doc.participants : [],
    taskTitle: doc.taskTitle,
    taskStatus: doc.taskStatus,
    ownerName: doc.ownerName,
    workerName: doc.workerName,
    ownerPhotoUrl: doc.ownerPhotoUrl,
    workerPhotoUrl: doc.workerPhotoUrl,
    lastMessage: doc.lastMessage ?? '',
    lastMessageAt: timestampToMillis(doc.lastMessageAt),
    lastMessageSenderId: doc.lastMessageSenderId ?? '',
    unreadCounts: doc.unreadCounts ?? {},
    status: doc.status ?? 'active',
    createdAt: timestampToMillis(doc.createdAt),
    updatedAt: timestampToMillis(doc.updatedAt),
  };
};

export const mapFirestoreMessage = (
  id: string,
  data: FirebaseFirestoreTypes.DocumentData | undefined,
): ChatMessage | null => {
  if (!data) {
    return null;
  }

  const doc = data as FirestoreMessageDocument;

  return {
    messageId: doc.messageId ?? id,
    chatRoomId: doc.chatRoomId,
    senderUid: doc.senderUid,
    receiverUid: doc.receiverUid,
    message: doc.message,
    messageType: doc.messageType ?? 'text',
    createdAt: timestampToMillis(doc.createdAt),
    isRead: Boolean(doc.isRead),
    isDelivered: Boolean(doc.isDelivered),
  };
};

export const toChatListItem = (room: ChatRoom, userId: string): ChatListItem => {
  const isOwner = room.ownerUid === userId;
  const otherParticipant = isOwner
    ? {
        uid: room.workerUid,
        name: room.workerName,
        photoUrl: room.workerPhotoUrl,
      }
    : {
        uid: room.ownerUid,
        name: room.ownerName,
        photoUrl: room.ownerPhotoUrl,
      };

  return {
    ...room,
    otherParticipant,
    unreadCount: room.unreadCounts[userId] ?? 0,
  };
};

export const isChatReadOnly = (taskStatus: TaskStatus): boolean =>
  taskStatus === 'completed' || taskStatus === 'cancelled';

export const chatRoomStatusForTask = (taskStatus: TaskStatus): ChatRoom['status'] => {
  if (taskStatus === 'completed' || taskStatus === 'cancelled') {
    return 'read_only';
  }
  if (taskStatus === 'open') {
    return 'closed';
  }
  return 'active';
};

export const buildChatRoomFromTask = (task: Task): ChatRoom => {
  const workerUid = task.workerId ?? '';
  return {
    chatRoomId: task.id,
    taskId: task.id,
    ownerUid: task.ownerId,
    workerUid,
    participants: workerUid ? [task.ownerId, workerUid] : [task.ownerId],
    taskTitle: task.title,
    taskStatus: task.status,
    ownerName: task.ownerName,
    workerName: task.workerName ?? 'Worker',
    lastMessage: '',
    lastMessageAt: new Date(task.createdAt).getTime(),
    lastMessageSenderId: '',
    unreadCounts: workerUid
      ? {
          [task.ownerId]: 0,
          [workerUid]: 0,
        }
      : { [task.ownerId]: 0 },
    status: chatRoomStatusForTask(task.status),
    createdAt: new Date(task.createdAt).getTime(),
    updatedAt: Date.now(),
  };
};
