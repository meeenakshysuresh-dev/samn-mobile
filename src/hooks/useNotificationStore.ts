import { create } from 'zustand';

export type AppNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: 'registration' | 'profile_updated' | 'push';
  createdAt: number;
  read: boolean;
};

type NotificationStoreState = {
  items: AppNotificationItem[];
  addNotification: (item: Omit<AppNotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  markAllRead: () => void;
  unreadCount: () => number;
};

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  items: [],

  addNotification: item => {
    const entry: AppNotificationItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      read: false,
    };

    set(state => ({ items: [entry, ...state.items].slice(0, 50) }));
  },

  markAllRead: () => {
    set(state => ({
      items: state.items.map(notification => ({ ...notification, read: true })),
    }));
  },

  unreadCount: () => get().items.filter(item => !item.read).length,
}));
