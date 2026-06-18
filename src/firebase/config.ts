/** Android application ID — must match Firebase console & google-services.json */
export const ANDROID_PACKAGE_NAME = 'com.rn_task_manager';

/** Firebase project ID from google-services.json */
export const FIREBASE_PROJECT_ID = 'samn-mobile';

/** App display name used in auth emails */
export const APP_NAME = 'SAMN';

/**
 * Custom continue URL for future App Links (requires samn.app in Firebase authorized domains).
 * Password reset & verification emails use FIREBASE_AUTH_ACTION_URL instead.
 */
export const AUTH_LINK_HOST = 'samn.app';
export const AUTH_LINK_PATH = '/auth';
export const AUTH_CONTINUE_URL = `https://${AUTH_LINK_HOST}${AUTH_LINK_PATH}`;

/** Firebase-hosted action URL — always authorized for verification/reset emails */
export const FIREBASE_AUTH_ACTION_URL = `https://${FIREBASE_PROJECT_ID}.firebaseapp.com/__/auth/action`;

/** Custom scheme fallback for in-app password reset handling */
export const AUTH_DEEP_LINK_PREFIXES = [
  `samn://${AUTH_LINK_PATH.replace(/^\//, '')}`,
  AUTH_CONTINUE_URL,
  `https://${AUTH_LINK_HOST}`,
  `https://${FIREBASE_PROJECT_ID}.firebaseapp.com`,
] as const;

export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  tasks: 'tasks',
  notifications: 'notifications',
} as const;

export const STORAGE_PATHS = {
  userAvatars: 'avatars',
} as const;
