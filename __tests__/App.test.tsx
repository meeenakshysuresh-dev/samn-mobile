/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../src/App';

const mockOnAuthStateChanged = jest.fn((auth: unknown, callback: (user: null) => void) => {
  callback(null);
  return jest.fn();
});

jest.mock('@react-native-firebase/app', () => ({
  getApp: () => ({ name: '[DEFAULT]' }),
}));

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
  })),
  onAuthStateChanged: mockOnAuthStateChanged,
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
  sendEmailVerification: jest.fn(),
  updateProfile: jest.fn(),
  reload: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false, data: () => undefined })),
  setDoc: jest.fn(),
  onSnapshot: jest.fn((_, onNext: (snap: { exists: () => boolean; data: () => undefined }) => void) => {
    onNext({ exists: () => false, data: () => undefined });
    return jest.fn();
  }),
  serverTimestamp: jest.fn(),
}));

jest.mock('@react-native-firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  getMessaging: jest.fn(() => ({})),
  getToken: jest.fn(() => Promise.resolve(null)),
  onMessage: jest.fn(() => jest.fn()),
  onTokenRefresh: jest.fn(() => jest.fn()),
  requestPermission: jest.fn(() => Promise.resolve(1)),
  setBackgroundMessageHandler: jest.fn(),
  AuthorizationStatus: {
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  },
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
    requestPermission: jest.fn(),
    onForegroundEvent: jest.fn(() => jest.fn()),
  },
  AndroidImportance: { HIGH: 4 },
  EventType: { PRESS: 1 },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: () => ({}),
  log: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    details: null,
  }),
}));

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  errorCodes: {
    OPERATION_CANCELED: 'OPERATION_CANCELED',
  },
  isErrorWithCode: jest.fn(),
  types: {
    allFiles: '*/*',
  },
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

jest.mock('react-native-blob-util', () => ({
  fs: {
    stat: jest.fn(),
  },
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  openURL: jest.fn(),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
