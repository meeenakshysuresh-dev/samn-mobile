export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'location';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read';

export type ChatMessage = {
  messageId: string;
  chatRoomId: string;
  senderUid: string;
  receiverUid: string;
  message: string;
  messageType: MessageType;
  createdAt: number;
  isRead: boolean;
  isDelivered: boolean;
};

export const getMessageDeliveryStatus = (message: ChatMessage): MessageDeliveryStatus => {
  if (message.isRead) {
    return 'read';
  }
  if (message.isDelivered) {
    return 'delivered';
  }
  return 'sent';
};
