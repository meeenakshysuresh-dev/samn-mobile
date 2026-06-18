const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Use at least 8 characters with mixed case and numbers.',
  'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
  'auth/network-request-failed': 'Network unavailable. Check your connection and try again.',
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/expired-action-code': 'This password reset link has expired. Request a new one.',
  'auth/invalid-action-code': 'This password reset link is invalid. Request a new one.',
  'auth/missing-email': 'Email address is required.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/requires-recent-login': 'Please sign in again to continue.',
  'auth/invalid-api-key':
    'Firebase is not configured for this device. Add your debug SHA-1 fingerprint in Firebase Console, re-download google-services.json, then rebuild the app.',
  'auth/app-not-authorized':
    'This app is not authorized for Firebase. Add SHA-1 fingerprint in Firebase Console for package com.rn_task_manager, then rebuild.',
  'firestore/permission-denied':
    'Firestore access denied. Publish security rules in Firebase Console (Firestore → Rules) to allow authenticated users to read/write their own profile.',
};

export const getFirebaseAuthErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Something went wrong. Please try again.';
  }

  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  const message = 'message' in error && typeof error.message === 'string' ? error.message : '';

  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  if (/api key not valid|invalid api key/i.test(message)) {
    return AUTH_ERROR_MESSAGES['auth/invalid-api-key'];
  }

  if (/app not authorized|certificate hash/i.test(message)) {
    return AUTH_ERROR_MESSAGES['auth/app-not-authorized'];
  }

  if (code === 'firestore/permission-denied' || /permission.denied|permission-denied/i.test(message)) {
    return AUTH_ERROR_MESSAGES['firestore/permission-denied'];
  }

  if (message) {
    return message;
  }

  return 'Something went wrong. Please try again.';
};
