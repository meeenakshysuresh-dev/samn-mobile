import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, AppView } from '../../components';
import { APP_LOGO } from '../../components/AppLogo/AppLogo';
import { useAuth } from '../../hooks/useAuth';
import { useHeaderStatusBar } from '../../hooks/useHeaderStatusBar';
import { navigationRef, onNavigationReady, resetToRoute } from '../../navigation/navigationRef';
import type { AuthRouteTarget } from '../../types/auth.types';
import { brand, fontFamily } from '../../theme/tokens';
import { normalize } from '../../components/AppText/sizes';
import { useThemeStore } from '../../theme/useThemeStore';

/**
 * Syncs root navigation with Firebase auth state (Splash → Auth → Verify → Profile → Main).
 */
/** Minimum time (ms) the splash screen must remain visible on launch. */
const MIN_SPLASH_DURATION = 4000;

export const AuthNavigationBridge = () => {
  const { resolveAuthRoute, initializing, pendingResetCode, clearPendingResetCode } = useAuth();
  const lastTarget = useRef<AuthRouteTarget | null>(null);
  const [navigationReady, setNavigationReady] = useState(() => navigationRef.isReady());
  const [minSplashElapsed, setMinSplashElapsed] = useState(false);

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
    const timer = setTimeout(() => setMinSplashElapsed(true), MIN_SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!navigationReady) {
      return;
    }

    if (initializing || !minSplashElapsed) {
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
  }, [
    navigationReady,
    initializing,
    minSplashElapsed,
    resolveAuthRoute,
    pendingResetCode,
    clearPendingResetCode,
  ]);

  useEffect(() => {
    if (!navigationReady || initializing || !minSplashElapsed || !pendingResetCode) {
      return;
    }

    resetToRoute('Auth', {
      screen: 'ResetPassword',
      params: { oobCode: pendingResetCode },
    });
    clearPendingResetCode();
  }, [navigationReady, initializing, minSplashElapsed, pendingResetCode, clearPendingResetCode]);

  return null;
};

const SPLASH_CAPTION = 'Someone Around Me Now';
const SPLASH_TAGLINE = 'Connecting people. Solving problems together.';

export const SplashScreen = () => {
  const theme = useThemeStore(state => state.theme);
  const insets = useSafeAreaInsets();

  useHeaderStatusBar();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const captionOpacity = useRef(new Animated.Value(0)).current;
  const captionTranslateY = useRef(new Animated.Value(14)).current;
  const captionPulse = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const entrance = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(captionOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(captionTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          delay: 150,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 500,
          delay: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    // Gentle looping shimmer on the caption once it has appeared.
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(captionPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(captionPulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    entrance.start(({ finished }) => {
      if (finished) {
        pulse.start();
      }
    });

    return () => {
      entrance.stop();
      pulse.stop();
    };
  }, [
    captionOpacity,
    captionPulse,
    captionTranslateY,
    logoOpacity,
    logoScale,
    taglineOpacity,
    taglineTranslateY,
  ]);

  const gradColors =
    Array.isArray(theme.gradientHeader) && theme.gradientHeader.length > 0
      ? [...theme.gradientHeader]
      : [theme.primaryDark, theme.primary];

  const captionAnimatedOpacity = Animated.multiply(
    captionOpacity,
    captionPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }),
  );

  return (
    <AppView style={styles.root}>
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fill, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <AppView style={styles.content}>
          <Animated.View
            style={[
              styles.logoCard,
              { opacity: logoOpacity, transform: [{ scale: logoScale }] },
            ]}
          >
            <Image source={APP_LOGO} style={styles.logoImage} resizeMode="contain" />
          </Animated.View>

          <Animated.View
            style={{
              opacity: captionOpacity,
              transform: [{ translateY: captionTranslateY }],
            }}
          >
            <AppText style={styles.brandName}>SAMN</AppText>
          </Animated.View>

          <Animated.Text
            style={[
              styles.caption,
              {
                opacity: captionAnimatedOpacity,
                transform: [{ translateY: captionTranslateY }],
              },
            ]}
          >
            {SPLASH_CAPTION}
          </Animated.Text>

          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: taglineOpacity,
                transform: [{ translateY: taglineTranslateY }],
              },
            ]}
          >
            {SPLASH_TAGLINE}
          </Animated.Text>
        </AppView>

        <ActivityIndicator size="large" color={brand.onPrimary} style={styles.loader} />
      </LinearGradient>
    </AppView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: brand.primaryDark,
  },
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCard: {
    width: 132,
    height: 132,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: brand.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandName: {
    marginTop: 28,
    color: brand.onPrimary,
    fontFamily: fontFamily.extrabold,
    fontSize: normalize(30),
    letterSpacing: normalize(6),
    textAlign: 'center',
  },
  caption: {
    marginTop: 12,
    color: brand.onPrimary,
    fontFamily: fontFamily.semibold,
    fontSize: normalize(18),
    letterSpacing: normalize(1.8),
    textAlign: 'center',
  },
  tagline: {
    marginTop: 16,
    paddingHorizontal: 28,
    color: brand.onPrimaryMuted,
    fontFamily: fontFamily.medium,
    fontSize: normalize(15),
    lineHeight: normalize(22),
    letterSpacing: normalize(0.4),
    textAlign: 'center',
  },
  loader: {
    marginBottom: 48,
  },
});
