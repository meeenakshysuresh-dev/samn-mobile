import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { ANDROID_PACKAGE_NAME, AUTH_CONTINUE_URL, FIREBASE_AUTH_ACTION_URL } from './config';

export type ParsedAuthDeepLink = {
  mode: 'resetPassword' | 'verifyEmail' | 'recoverEmail' | 'signIn' | 'unknown';
  oobCode: string | null;
  apiKey: string | null;
  continueUrl: string | null;
};

const getAuthActionCodeSettings = (): FirebaseAuthTypes.ActionCodeSettings => ({
  url: FIREBASE_AUTH_ACTION_URL,
  handleCodeInApp: true,
  android: {
    packageName: ANDROID_PACKAGE_NAME,
    installApp: true,
    minimumVersion: '1',
  },
});

export const getPasswordResetActionCodeSettings = (): FirebaseAuthTypes.ActionCodeSettings => ({
  ...getAuthActionCodeSettings(),
  url: AUTH_CONTINUE_URL,
});

export const getEmailVerificationActionCodeSettings = (): FirebaseAuthTypes.ActionCodeSettings =>
  getAuthActionCodeSettings();

const getQueryParam = (url: string, key: string): string | null => {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const parseAuthDeepLink = (url: string): ParsedAuthDeepLink | null => {
  if (!url) {
    return null;
  }

  try {
    const modeParam = getQueryParam(url, 'mode') ?? '';
    const oobCode = getQueryParam(url, 'oobCode');
    const apiKey = getQueryParam(url, 'apiKey');
    const continueUrl = getQueryParam(url, 'continueUrl');

    const mode = isAuthMode(modeParam) ? modeParam : 'unknown';

    if (!oobCode && mode === 'unknown') {
      return null;
    }

    return { mode, oobCode, apiKey, continueUrl };
  } catch {
    return null;
  }
};

const isAuthMode = (
  value: string,
): value is 'resetPassword' | 'verifyEmail' | 'recoverEmail' | 'signIn' => {
  return (
    value === 'resetPassword' ||
    value === 'verifyEmail' ||
    value === 'recoverEmail' ||
    value === 'signIn'
  );
};

export const isPasswordResetLink = (url: string): boolean => {
  const parsed = parseAuthDeepLink(url);
  return parsed?.mode === 'resetPassword' && Boolean(parsed.oobCode);
};
