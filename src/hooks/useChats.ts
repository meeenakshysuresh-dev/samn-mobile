import { useMemo } from 'react';

import { useChatStore } from '../store/useChatStore';
import type { ChatRoom } from '../types/chat.types';
import type { ChatMessage } from '../types/message.types';
import { toChatListItem } from '../utils/chatMapper';

const EMPTY_MESSAGES: ChatMessage[] = [];

const countLocalUnread = (messages: ChatMessage[], userId: string): number =>
  messages.filter(message => message.receiverUid === userId && !message.isRead).length;

const resolveRoomUnread = (
  room: ChatRoom,
  userId: string,
  messages: ChatMessage[],
): number => Math.max(room.unreadCounts[userId] ?? 0, countLocalUnread(messages, userId));

export const useChatRooms = (userId: string) => {
  const rooms = useChatStore(state => state.rooms);
  const messagesByRoom = useChatStore(state => state.messagesByRoom);
  const loading = useChatStore(state => state.loading);
  const error = useChatStore(state => state.error);

  const chatList = useMemo(
    () =>
      rooms.map(room => {
        const item = toChatListItem(room, userId);
        const unreadCount = resolveRoomUnread(
          room,
          userId,
          messagesByRoom[room.chatRoomId] ?? [],
        );
        return { ...item, unreadCount };
      }),
    [messagesByRoom, rooms, userId],
  );

  const totalUnread = useMemo(
    () =>
      rooms.reduce(
        (total, room) =>
          total + resolveRoomUnread(room, userId, messagesByRoom[room.chatRoomId] ?? []),
        0,
      ),
    [messagesByRoom, rooms, userId],
  );

  return { chatList, loading, error, totalUnread };
};

export const useChatRoom = (chatRoomId: string) =>
  useChatStore(state => state.getRoomById(chatRoomId));

export const useChatUnreadCount = (userId: string) => {
  const rooms = useChatStore(state => state.rooms);
  const messagesByRoom = useChatStore(state => state.messagesByRoom);

  return useMemo(() => {
    if (!userId || userId === 'guest-user') {
      return 0;
    }
    return rooms.reduce(
      (total, room) =>
        total + resolveRoomUnread(room, userId, messagesByRoom[room.chatRoomId] ?? []),
      0,
    );
  }, [messagesByRoom, rooms, userId]);
};

export const useChatRoomUnreadCount = (chatRoomId: string, userId: string) => {
  const room = useChatStore(state => state.getRoomById(chatRoomId));
  const messages = useChatStore(state => state.messagesByRoom[chatRoomId] ?? EMPTY_MESSAGES);

  return useMemo(() => {
    if (!room || !userId || userId === 'guest-user') {
      return 0;
    }
    return resolveRoomUnread(room, userId, messages);
  }, [messages, room, userId]);
};
