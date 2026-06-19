import { useMemo } from 'react';
import { create } from 'zustand';

import type { TaskNotificationEventType } from '../types/notification.types';

export type AppNotificationType = 'registration' | 'profile_updated' | 'push' | 'task' | 'chat';

export type AppNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: AppNotificationType;
  taskId?: string;
  chatRoomId?: string;
  eventType?: TaskNotificationEventType;
  createdAt: number;
  readAt?: number;
  read: boolean;
};

type NotificationStoreState = {
  items: AppNotificationItem[];
  addNotification: (
    item: Omit<AppNotificationItem, 'id' | 'createdAt' | 'read'> & {
      id?: string;
      createdAt?: number;
      read?: boolean;
      readAt?: number;
    },
  ) => void;
  syncNotifications: (items: AppNotificationItem[]) => void;
  markAsRead: (notificationId: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
};

const areNotificationListsEqual = (
  left: AppNotificationItem[],
  right: AppNotificationItem[],
): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((item, index) => {
    const other = right[index];
    return (
      other?.id === item.id &&
      other?.read === item.read &&
      other?.createdAt === item.createdAt &&
      other?.title === item.title &&
      other?.body === item.body
    );
  });
};

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  items: [],

  addNotification: item => {
    const entry: AppNotificationItem = {
      ...item,
      id: item.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: item.createdAt ?? Date.now(),
      read: item.read ?? false,
    };

    set(state => {
      if (state.items.some(existing => existing.id === entry.id)) {
        return state;
      }
      return { items: [entry, ...state.items].slice(0, 50) };
    });
  },

  syncNotifications: items => {
    set(state => {
      const localOnly = state.items.filter(item => item.type !== 'task' && item.type !== 'chat');
      const merged = [...items, ...localOnly]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 50);

      if (areNotificationListsEqual(merged, state.items)) {
        return state;
      }

      return { items: merged };
    });
  },

  markAsRead: notificationId => {
    set(state => {
      const target = state.items.find(notification => notification.id === notificationId);
      if (!target || target.read) {
        return state;
      }

      return {
        items: state.items.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true, readAt: notification.readAt ?? Date.now() }
            : notification,
        ),
      };
    });
  },

  markAllRead: () => {
    set(state => {
      if (state.items.every(notification => notification.read)) {
        return state;
      }

      return {
        items: state.items.map(notification => ({
          ...notification,
          read: true,
          readAt: notification.readAt ?? Date.now(),
        })),
      };
    });
  },

  unreadCount: () => get().items.filter(item => !item.read).length,
}));

export const useNotificationItems = () => useNotificationStore(state => state.items);

export const useUnreadNotificationCount = () =>
  useNotificationStore(state => state.items.reduce((count, item) => count + (item.read ? 0 : 1), 0));

export const useTaskNotifications = () => {
  const items = useNotificationStore(state => state.items);
  return useMemo(() => items.filter(item => item.type === 'task'), [items]);
};
