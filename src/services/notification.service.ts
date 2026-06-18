import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  requestPermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

import { useNotificationStore } from '../hooks/useNotificationStore';
import { useSettingsStore } from '../hooks/useSettingsStore';
import { updateUserProfile } from './user.service';

export const SAMN_CHANNEL_ID = 'samn_default';

let foregroundUnsubscribe: (() => void) | undefined;

const canDisplayNotifications = () => useSettingsStore.getState().pushNotificationsEnabled;

export const createDefaultChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  await notifee.createChannel({
    id: SAMN_CHANNEL_ID,
    name: 'SAMN Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

export const requestAndroidNotificationPermission = async () => {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const requestPushPermission = async (): Promise<boolean> => {
  await requestAndroidNotificationPermission();

  const authStatus = await requestPermission(getMessaging());
  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
};

export const displayLocalNotification = async (
  title: string,
  body: string,
  type: 'registration' | 'profile_updated' | 'push',
) => {
  if (!canDisplayNotifications()) {
    return;
  }

  useNotificationStore.getState().addNotification({ title, body, type });

  await createDefaultChannel();
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: SAMN_CHANNEL_ID,
      pressAction: { id: 'default' },
      smallIcon: 'ic_launcher',
    },
  });
};

export const notifyRegistrationSuccess = async (fullName?: string) => {
  const firstName = fullName?.trim().split(/\s+/)[0] ?? 'there';
  await displayLocalNotification(
    'Welcome to SAMN',
    `Hi ${firstName}, your account was created successfully.`,
    'registration',
  );
};

export const notifyProfileUpdated = async () => {
  await displayLocalNotification(
    'Profile Updated',
    'Your profile changes were saved successfully.',
    'profile_updated',
  );
};

export const registerDeviceToken = async (uid: string) => {
  const enabled = useSettingsStore.getState().pushNotificationsEnabled;
  if (!enabled) {
    return;
  }

  const granted = await requestPushPermission();
  if (!granted) {
    return;
  }

  const token = await getToken(getMessaging());
  if (token) {
    await updateUserProfile(uid, { fcmToken: token });
  }
};

export const initializeNotifications = async (uid?: string | null) => {
  await createDefaultChannel();
  await notifee.requestPermission();

  if (uid) {
    await registerDeviceToken(uid);
  }

  foregroundUnsubscribe?.();
  foregroundUnsubscribe = onMessage(getMessaging(), async remoteMessage => {
    const title = remoteMessage.notification?.title ?? 'SAMN';
    const body = remoteMessage.notification?.body ?? 'You have a new notification.';
    await displayLocalNotification(title, body, 'push');
  });

  return onTokenRefresh(getMessaging(), async token => {
    if (uid && token) {
      await updateUserProfile(uid, { fcmToken: token });
    }
  });
};

export const teardownNotifications = () => {
  foregroundUnsubscribe?.();
  foregroundUnsubscribe = undefined;
};

export const registerBackgroundMessageHandler = () => {
  setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
    const title = remoteMessage.notification?.title ?? 'SAMN';
    const body = remoteMessage.notification?.body ?? 'You have a new notification.';

    if (!useSettingsStore.getState().pushNotificationsEnabled) {
      return;
    }

    await createDefaultChannel();
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: SAMN_CHANNEL_ID,
        pressAction: { id: 'default' },
        smallIcon: 'ic_launcher',
      },
    });
  });
};

export const setupNotifeeForegroundEvents = () =>
  notifee.onForegroundEvent(({ type }) => {
    if (type === EventType.PRESS) {
      // Navigation handled by Notifications screen entry points.
    }
  });
