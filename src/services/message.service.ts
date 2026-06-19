import {
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from '@react-native-firebase/firestore';

import { getCurrentUser } from '../firebase/auth';
import {
  chatMessageDocument,
  chatMessagesCollection,
  serverTimestamp,
} from '../firebase/firestore';
import type { ChatRoom } from '../types/chat.types';
import type { FirestoreMessageDocument } from '../types/chat.firestore.types';
import type { ChatMessage } from '../types/message.types';
import { mapFirestoreMessage } from '../utils/chatMapper';
import { logError } from '../utils/errorLogger';
import { stripUndefined } from '../utils/firestoreHelpers';
import {
  assertChatRoomParticipant,
  incrementUnreadCount,
  resetUnreadCount,
  updateChatRoomLastMessage,
} from './chat.service';
import { dispatchChatMessageNotification } from './chatNotification.service';

export class MessageServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MessageServiceError';
  }
}

const requireAuthUid = (): string => {
  const uid = getCurrentUser()?.uid;
  if (!uid) {
    throw new MessageServiceError('You must be signed in to send messages.');
  }
  return uid;
};

const getOtherParticipantUid = (room: ChatRoom, senderUid: string): string =>
  room.ownerUid === senderUid ? room.workerUid : room.ownerUid;

export const sendTextMessage = async (
  chatRoomId: string,
  messageText: string,
): Promise<ChatMessage> => {
  const senderUid = requireAuthUid();
  const trimmed = messageText.trim();

  if (!trimmed) {
    throw new MessageServiceError('Message cannot be empty.');
  }

  const room = await assertChatRoomParticipant(chatRoomId, senderUid);

  if (room.status !== 'active') {
    throw new MessageServiceError('This chat is read-only.');
  }

  const receiverUid = getOtherParticipantUid(room, senderUid);
  const messageRef = doc(chatMessagesCollection(chatRoomId));
  const messageId = messageRef.id;

  const payload = stripUndefined({
    messageId,
    chatRoomId,
    senderUid,
    receiverUid,
    message: trimmed,
    messageType: 'text',
    createdAt: serverTimestamp(),
    isRead: false,
    isDelivered: false,
  }) as FirestoreMessageDocument;

  await setDoc(messageRef, payload);
  await updateChatRoomLastMessage(chatRoomId, senderUid, trimmed);
  await incrementUnreadCount(chatRoomId, receiverUid);

  const senderName = room.ownerUid === senderUid ? room.ownerName : room.workerName;
  dispatchChatMessageNotification({
    chatRoomId,
    taskId: room.taskId,
    recipientUid: receiverUid,
    senderUid,
    senderName,
    taskTitle: room.taskTitle,
    messagePreview: trimmed,
  });

  return {
    messageId,
    chatRoomId,
    senderUid,
    receiverUid,
    message: trimmed,
    messageType: 'text',
    createdAt: Date.now(),
    isRead: false,
    isDelivered: false,
  };
};

export const subscribeToRoomMessages = (
  chatRoomId: string,
  onNext: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void,
) => {
  if (!chatRoomId?.trim()) {
    onNext([]);
    return () => undefined;
  }

  return onSnapshot(
    chatMessagesCollection(chatRoomId),
    snapshot => {
      const messages = snapshot.docs
        .map(docSnap => mapFirestoreMessage(docSnap.id, docSnap.data()))
        .filter((message): message is ChatMessage => message !== null)
        .sort((a, b) => a.createdAt - b.createdAt);
      onNext(messages);
    },
    error => {
      logError('MessageService.subscribeToRoomMessages', error, { chatRoomId });
      onError?.(error);
    },
  );
};

export const markUndeliveredMessagesAsDelivered = async (
  chatRoomId: string,
  receiverUid: string,
): Promise<void> => {
  const snapshot = await getDocs(chatMessagesCollection(chatRoomId));
  const batch = writeBatch(getFirestore());
  let hasUpdates = false;

  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data() as FirestoreMessageDocument;
    if (data.receiverUid === receiverUid && !data.isDelivered) {
      batch.update(docSnap.ref, { isDelivered: true });
      hasUpdates = true;
    }
  });

  if (hasUpdates) {
    await batch.commit();
  }
};

export const markRoomMessagesAsRead = async (
  chatRoomId: string,
  readerUid: string,
): Promise<void> => {
  const snapshot = await getDocs(chatMessagesCollection(chatRoomId));
  const batch = writeBatch(getFirestore());
  let hasUpdates = false;

  snapshot.docs.forEach(docSnap => {
    const data = docSnap.data() as FirestoreMessageDocument;
    if (data.receiverUid === readerUid && !data.isRead) {
      batch.update(docSnap.ref, { isRead: true, isDelivered: true });
      hasUpdates = true;
    }
  });

  if (hasUpdates) {
    await batch.commit();
  }

  await resetUnreadCount(chatRoomId, readerUid);
};

export const markSingleMessageDelivered = async (
  chatRoomId: string,
  messageId: string,
): Promise<void> => {
  await updateDoc(chatMessageDocument(chatRoomId, messageId), {
    isDelivered: true,
  });
};
