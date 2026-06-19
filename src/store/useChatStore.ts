import { create } from 'zustand';

import type { ChatRoom } from '../types/chat.types';
import type { ChatMessage } from '../types/message.types';

type ChatStoreState = {
  rooms: ChatRoom[];
  loading: boolean;
  error: string | null;
  activeRoomId: string | null;
  messagesByRoom: Record<string, ChatMessage[]>;
  applyRoomsSync: (rooms: ChatRoom[]) => void;
  setRoomMessages: (chatRoomId: string, messages: ChatMessage[]) => void;
  setActiveRoomId: (chatRoomId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  totalUnreadCount: (userId: string) => number;
  getRoomById: (chatRoomId: string) => ChatRoom | undefined;
};

const initialState = {
  rooms: [] as ChatRoom[],
  loading: false,
  error: null as string | null,
  activeRoomId: null as string | null,
  messagesByRoom: {} as Record<string, ChatMessage[]>,
};

export const useChatStore = create<ChatStoreState>((set, get) => ({
  ...initialState,

  applyRoomsSync: rooms => {
    set({ rooms, loading: false, error: null });
  },

  setRoomMessages: (chatRoomId, messages) => {
    set(state => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [chatRoomId]: messages,
      },
    }));
  },

  setActiveRoomId: activeRoomId => set({ activeRoomId }),

  setLoading: loading => set({ loading }),

  setError: error => set({ error, loading: false }),

  reset: () => set({ ...initialState }),

  totalUnreadCount: userId =>
    get().rooms.reduce((total, room) => total + (room.unreadCounts[userId] ?? 0), 0),

  getRoomById: chatRoomId => get().rooms.find(room => room.chatRoomId === chatRoomId),
}));
