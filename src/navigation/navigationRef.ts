import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from '../navigation/RootNavigator.types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

type PendingReset = {
  name: keyof RootStackParamList;
  params?: object;
};

let pendingReset: PendingReset | null = null;
const navigationReadyListeners = new Set<() => void>();

const applyReset = ({ name, params }: PendingReset) => {
  navigationRef.reset({
    index: 0,
    routes: [{ name, params } as never],
  });
};

export const resetToHomeDashboard = () => {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.reset({
    index: 0,
    routes: [
      {
        name: 'MainTabs',
        state: {
          routes: [
            { name: 'CreateStack' },
            { name: 'ChatStack' },
            { name: 'HomeStack', state: { routes: [{ name: 'Dashboard' }] } },
            { name: 'ProfileStack' },
            { name: 'SettingsStack' },
          ],
          index: 2,
        },
      } as never,
    ],
  });
};

export const resetToRoute = (name: keyof RootStackParamList, params?: object) => {
  if (name === 'MainTabs') {
    resetToHomeDashboard();
    return;
  }

  const reset: PendingReset = { name, params };

  if (navigationRef.isReady()) {
    pendingReset = null;
    applyReset(reset);
    return;
  }

  pendingReset = reset;
};

export const flushPendingNavigation = () => {
  if (pendingReset && navigationRef.isReady()) {
    const reset = pendingReset;
    pendingReset = null;
    if (reset.name === 'MainTabs') {
      resetToHomeDashboard();
    } else {
      applyReset(reset);
    }
  }

  navigationReadyListeners.forEach(listener => listener());
};

export const onNavigationReady = (listener: () => void) => {
  navigationReadyListeners.add(listener);
  return () => {
    navigationReadyListeners.delete(listener);
  };
};

export const navigateToResetPassword = (oobCode: string) => {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.dispatch(
    CommonActions.navigate({
      name: 'Auth',
      params: {
        screen: 'ResetPassword',
        params: { oobCode },
      },
    }),
  );
};

export const openChatThread = (chatRoomId: string) => {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.navigate('MainTabs', {
    screen: 'ChatStack',
    params: {
      screen: 'ChatThread',
      params: { chatRoomId },
    },
  } as never);
};
