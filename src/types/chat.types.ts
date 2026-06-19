import type { TaskStatus } from './task.types';

export type ChatRoomStatus = 'active' | 'read_only' | 'closed';

export type ChatParticipantProfile = {
  uid: string;
  name: string;
  photoUrl?: string;
};

export type ChatRoom = {
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
  lastMessageAt: number;
  lastMessageSenderId: string;
  unreadCounts: Record<string, number>;
  status: ChatRoomStatus;
  createdAt: number;
  updatedAt: number;
};

export type ChatListItem = ChatRoom & {
  otherParticipant: ChatParticipantProfile;
  unreadCount: number;
};
