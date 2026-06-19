import { useEffect, useRef } from 'react';

import { showLocalPush } from '../services/notification.service';
import {
  markAllUserNotificationsRead,
  markNotificationAsRead,
  subscribeToUserNotifications,
} from '../services/taskNotification.service';
import { logError } from '../utils/errorLogger';
import { useNotificationStore } from './useNotificationStore';

export const useNotificationSync = (userId: string | null | undefined) => {
  const initializedRef = useRef(false);
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const { syncNotifications } = useNotificationStore.getState();

    if (!userId) {
      initializedRef.current = false;
      seenIdsRef.current = new Set();
      syncNotifications([]);
      return;
    }

    const unsubscribe = subscribeToUserNotifications(
      userId,
      notifications => {
        useNotificationStore.getState().syncNotifications(notifications);

        notifications.forEach(notification => {
          if (seenIdsRef.current.has(notification.id)) {
            return;
          }
          seenIdsRef.current.add(notification.id);

          if (!initializedRef.current) {
            return;
          }

          if (!notification.read) {
            void showLocalPush(notification.title, notification.body, {
              chatRoomId: notification.chatRoomId ?? '',
              taskId: notification.taskId ?? '',
              type: notification.type,
            });
          }
        });

        initializedRef.current = true;
      },
      error => {
        logError('useNotificationSync', error, { userId });
      },
    );

    return () => {
      unsubscribe();
      initializedRef.current = false;
      seenIdsRef.current = new Set();
    };
  }, [userId]);
};

export const markNotificationRead = async (
  userId: string | null | undefined,
  notificationId: string,
) => {
  const notification = useNotificationStore
    .getState()
    .items.find(item => item.id === notificationId);

  useNotificationStore.getState().markAsRead(notificationId);

  if (!userId || !notification || (notification.type !== 'task' && notification.type !== 'chat')) {
    return;
  }

  try {
    await markNotificationAsRead(notificationId, userId);
  } catch (error) {
    logError('markNotificationRead', error, { userId, notificationId });
  }
};

export const markNotificationsRead = async (userId: string | null | undefined) => {
  const taskNotificationIds = useNotificationStore
    .getState()
    .items.filter(item => (item.type === 'task' || item.type === 'chat') && !item.read)
    .map(item => item.id);

  useNotificationStore.getState().markAllRead();

  if (!userId || taskNotificationIds.length === 0) {
    return;
  }

  try {
    await markAllUserNotificationsRead(userId);
  } catch (error) {
    logError('markNotificationsRead', error, { userId });
  }
};
