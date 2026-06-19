import { doc, setDoc } from '@react-native-firebase/firestore';

import { notificationsCollection, serverTimestamp } from '../firebase/firestore';
import type { FirestoreNotificationDocument } from '../types/notification.types';
import { logError } from '../utils/errorLogger';
import { stripUndefined } from '../utils/firestoreHelpers';

type ChatMessageNotificationInput = {
  chatRoomId: string;
  taskId: string;
  recipientUid: string;
  senderUid: string;
  senderName: string;
  taskTitle: string;
  messagePreview: string;
};

export const sendChatMessageNotification = async ({
  chatRoomId,
  taskId,
  recipientUid,
  senderUid,
  senderName,
  taskTitle,
  messagePreview,
}: ChatMessageNotificationInput): Promise<void> => {
  const notificationRef = doc(notificationsCollection());
  const notificationId = notificationRef.id;
  const preview =
    messagePreview.length > 120 ? `${messagePreview.slice(0, 117)}...` : messagePreview;

  const document = stripUndefined({
    notificationId,
    userId: recipientUid,
    taskId,
    chatRoomId,
    eventType: 'chat_message',
    title: `${senderName} — ${taskTitle}`,
    body: preview,
    actorUid: senderUid,
    actorName: senderName.trim(),
    read: false,
    createdAt: serverTimestamp(),
  }) as FirestoreNotificationDocument;

  await setDoc(notificationRef, document);
};

export const dispatchChatMessageNotification = (input: ChatMessageNotificationInput): void => {
  void sendChatMessageNotification(input).catch(error => {
    logError('ChatNotification.dispatch', error, {
      chatRoomId: input.chatRoomId,
      recipientUid: input.recipientUid,
    });
  });
};
