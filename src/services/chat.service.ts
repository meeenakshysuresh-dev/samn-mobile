import {
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { getCurrentUser } from '../firebase/auth';
import {
  chatRoomDocument,
  serverTimestamp,
} from '../firebase/firestore';
import type { ChatRoom } from '../types/chat.types';
import type { FirestoreChatRoomDocument } from '../types/chat.firestore.types';
import type { Task, TaskStatus } from '../types/task.types';
import {
  buildChatRoomFromTask,
  chatRoomStatusForTask,
  mapFirestoreChatRoom,
} from '../utils/chatMapper';
import { logError } from '../utils/errorLogger';
import { stripUndefined } from '../utils/firestoreHelpers';
import { canAccessTaskChat } from '../utils/taskWorkflow';

export class ChatServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

const requireAuthUid = (): string => {
  const uid = getCurrentUser()?.uid;
  if (!uid) {
    throw new ChatServiceError('You must be signed in to access chat.');
  }
  return uid;
};

const isPermissionDenied = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  return code === 'firestore/permission-denied';
};

export const CHAT_PERMISSION_DENIED_MESSAGE =
  'Chat requires updated Firestore rules. In Firebase Console → Firestore → Rules, publish the latest firestore.rules file, then reload the app.';

const sortRooms = (rooms: ChatRoom[]): ChatRoom[] =>
  [...rooms].sort((a, b) => b.lastMessageAt - a.lastMessageAt);

const getChatRoomOrNull = async (chatRoomId: string): Promise<ChatRoom | null> => {
  const snapshot = await getDoc(chatRoomDocument(chatRoomId));
  if (!snapshot.exists()) {
    return null;
  }
  return mapFirestoreChatRoom(chatRoomId, snapshot.data());
};

export const ensureChatRoomForTask = async (task: Task): Promise<ChatRoom> => {
  const workerUid = task.workerId;
  if (!workerUid || !canAccessTaskChat(task)) {
    throw new ChatServiceError('Chat is only available for accepted tasks.');
  }

  const chatRoomId = task.id;
  const existing = await getChatRoomOrNull(chatRoomId);

  if (existing) {
    if (existing.status !== 'active' && chatRoomStatusForTask(task.status) === 'active') {
      await updateDoc(chatRoomDocument(chatRoomId), {
        status: 'active',
        taskStatus: task.status,
        workerUid,
        workerName: task.workerName ?? existing.workerName,
        participants: [task.ownerId, workerUid],
        updatedAt: serverTimestamp(),
      });
      const refreshed = await getChatRoomOrNull(chatRoomId);
      if (refreshed) {
        return refreshed;
      }
    }
    return existing;
  }

  const payload = stripUndefined({
    chatRoomId,
    taskId: task.id,
    ownerUid: task.ownerId,
    workerUid,
    participants: [task.ownerId, workerUid],
    taskTitle: task.title.trim(),
    taskStatus: task.status,
    ownerName: task.ownerName,
    workerName: task.workerName ?? 'Worker',
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: '',
    unreadCounts: {
      [task.ownerId]: 0,
      [workerUid]: 0,
    },
    status: chatRoomStatusForTask(task.status),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }) as FirestoreChatRoomDocument;

  await setDoc(chatRoomDocument(chatRoomId), payload);
  const created = await getChatRoomOrNull(chatRoomId);
  if (!created) {
    throw new ChatServiceError('Failed to create chat room.');
  }
  return created;
};

export const syncChatRoomTaskStatus = async (
  taskId: string,
  taskStatus: TaskStatus,
  workerUid?: string,
  workerName?: string,
): Promise<void> => {
  const snapshot = await getDoc(chatRoomDocument(taskId));
  if (!snapshot.exists()) {
    return;
  }

  const updates: Partial<FirestoreChatRoomDocument> = {
    taskStatus,
    status: chatRoomStatusForTask(taskStatus),
    updatedAt: serverTimestamp(),
  };

  if (workerUid) {
    updates.workerUid = workerUid;
  }
  if (workerName) {
    updates.workerName = workerName;
  }

  await updateDoc(chatRoomDocument(taskId), updates);
};

export const getChatRoomById = async (chatRoomId: string): Promise<ChatRoom | null> =>
  getChatRoomOrNull(chatRoomId);

export const subscribeToUserChatRooms = (
  tasks: Task[],
  userId: string,
  onNext: (rooms: ChatRoom[]) => void,
  onError?: (error: Error) => void,
) => {
  const eligibleTasks = tasks.filter(task => canAccessTaskChat(task, userId));
  const roomState = new Map<string, ChatRoom>();
  let permissionDenied = false;

  const emit = () => {
    if (permissionDenied) {
      onNext(sortRooms(eligibleTasks.map(buildChatRoomFromTask)));
      return;
    }

    const rooms = eligibleTasks.map(task => roomState.get(task.id) ?? buildChatRoomFromTask(task));
    onNext(sortRooms(rooms));
  };

  if (eligibleTasks.length === 0) {
    onNext([]);
    return () => undefined;
  }

  emit();

  const unsubscribes = eligibleTasks.map(task =>
    onSnapshot(
      chatRoomDocument(task.id),
      snapshot => {
        if (snapshot.exists()) {
          const room = mapFirestoreChatRoom(task.id, snapshot.data());
          if (room) {
            roomState.set(task.id, room);
          }
        } else {
          roomState.set(task.id, buildChatRoomFromTask(task));
        }
        emit();
      },
      error => {
        if (isPermissionDenied(error)) {
          permissionDenied = true;
          logError('ChatService.subscribeToUserChatRooms', error, { userId, taskId: task.id });
          onError?.(new ChatServiceError(CHAT_PERMISSION_DENIED_MESSAGE));
          emit();
          return;
        }
        logError('ChatService.subscribeToUserChatRooms', error, { userId, taskId: task.id });
        onError?.(error);
      },
    ),
  );

  return () => {
    unsubscribes.forEach(unsubscribe => unsubscribe());
  };
};

export const assertChatRoomParticipant = async (
  chatRoomId: string,
  userId?: string,
): Promise<ChatRoom> => {
  const uid = userId ?? requireAuthUid();
  const room = await getChatRoomOrNull(chatRoomId);
  if (!room) {
    throw new ChatServiceError('Chat room not found.');
  }
  if (!room.participants.includes(uid)) {
    throw new ChatServiceError('You do not have access to this chat.');
  }
  return room;
};

export const resetUnreadCount = async (chatRoomId: string, userId: string): Promise<void> => {
  const room = await assertChatRoomParticipant(chatRoomId, userId);
  if ((room.unreadCounts[userId] ?? 0) === 0) {
    return;
  }

  await updateDoc(chatRoomDocument(chatRoomId), {
    [`unreadCounts.${userId}`]: 0,
    updatedAt: serverTimestamp(),
  });
};

export const incrementUnreadCount = async (
  chatRoomId: string,
  recipientUid: string,
): Promise<void> => {
  const room = await getChatRoomOrNull(chatRoomId);
  if (!room) {
    return;
  }

  const current = room.unreadCounts[recipientUid] ?? 0;
  await updateDoc(chatRoomDocument(chatRoomId), {
    [`unreadCounts.${recipientUid}`]: current + 1,
    updatedAt: serverTimestamp(),
  });
};

export const updateChatRoomLastMessage = async (
  chatRoomId: string,
  senderUid: string,
  message: string,
): Promise<void> => {
  await updateDoc(chatRoomDocument(chatRoomId), {
    lastMessage: message.trim(),
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: senderUid,
    updatedAt: serverTimestamp(),
  });
};
