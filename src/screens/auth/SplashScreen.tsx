import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { AppText, AppView } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { navigationRef, onNavigationReady, resetToRoute } from '../../navigation/navigationRef';
import type { AuthRouteTarget } from '../../types/auth.types';
import { brand } from '../../theme/tokens';
import { useThemeStore } from '../../theme/useThemeStore';
import { authStyles } from './authStyles';

/**
 * Syncs root navigation with Firebase auth state (Splash → Auth → Verify → Profile → Main).
 */
export const AuthNavigationBridge = () => {
  const { resolveAuthRoute, initializing, pendingResetCode, clearPendingResetCode } = useAuth();
  const lastTarget = useRef<AuthRouteTarget | null>(null);
  const [navigationReady, setNavigationReady] = useState(() => navigationRef.isReady());

  useEffect(() => {
    if (navigationRef.isReady()) {
      setNavigationReady(true);
    }

    return onNavigationReady(() => {
      lastTarget.current = null;
      setNavigationReady(true);
    });
  }, []);

  useEffect(() => {
    if (!navigationReady) {
      return;
    }

    if (initializing) {
      if (lastTarget.current !== 'Splash') {
        lastTarget.current = 'Splash';
        resetToRoute('Splash');
      }
      return;
    }

    const target = resolveAuthRoute();
    if (target === lastTarget.current) {
      return;
    }

    lastTarget.current = target;

    switch (target) {
      case 'Auth':
        if (pendingResetCode) {
          resetToRoute('Auth', {
            screen: 'ResetPassword',
            params: { oobCode: pendingResetCode },
          });
          clearPendingResetCode();
        } else {
          resetToRoute('Auth');
        }
        break;
      case 'EmailVerification':
        resetToRoute('EmailVerification');
        break;
      case 'CompleteProfile':
        resetToRoute('CompleteProfile');
        break;
      case 'MainTabs':
        resetToRoute('MainTabs');
        break;
      default:
        break;
    }
  }, [navigationReady, initializing, resolveAuthRoute, pendingResetCode, clearPendingResetCode]);

  useEffect(() => {
    if (!navigationReady || initializing || !pendingResetCode) {
      return;
    }

    resetToRoute('Auth', {
      screen: 'ResetPassword',
      params: { oobCode: pendingResetCode },
    });
    clearPendingResetCode();
  }, [navigationReady, initializing, pendingResetCode, clearPendingResetCode]);

  return null;
};

export const SplashScreen = () => {
  const theme = useThemeStore(state => state.theme);

  return (
    <AppView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      }}
    >
      <AppText style={authStyles.logo}>SAMN</AppText>
      <ActivityIndicator size="large" color={brand.primary} style={{ marginTop: 24 }} />
    </AppView>
  );
};
