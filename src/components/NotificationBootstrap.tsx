import { useEffect } from 'react';

import { useAuth } from '../hooks/useAuth';
import { useSettingsStore } from '../hooks/useSettingsStore';
import {
  initializeNotifications,
  registerDeviceToken,
  setupNotifeeForegroundEvents,
  teardownNotifications,
} from '../services/notification.service';

export const NotificationBootstrap = () => {
  const { user } = useAuth();
  const pushNotificationsEnabled = useSettingsStore(state => state.pushNotificationsEnabled);
  const hydrated = useSettingsStore(state => state.hydrated);

  useEffect(() => {
    const unsubscribeEvents = setupNotifeeForegroundEvents();
    return () => {
      unsubscribeEvents();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    let tokenUnsubscribe: (() => void) | undefined;

    const bootstrap = async () => {
      teardownNotifications();
      if (user && pushNotificationsEnabled) {
        tokenUnsubscribe = await initializeNotifications(user.uid);
      }
    };

    void bootstrap();

    return () => {
      tokenUnsubscribe?.();
      teardownNotifications();
    };
  }, [hydrated, pushNotificationsEnabled, user?.uid]);

  useEffect(() => {
    if (user?.uid && hydrated && pushNotificationsEnabled) {
      void registerDeviceToken(user.uid);
    }
  }, [hydrated, pushNotificationsEnabled, user?.uid]);

  return null;
};
