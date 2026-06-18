import {
  confirmPasswordReset as confirmPasswordResetAction,
  createUserWithEmailAndPassword,
  getFirebaseAuth,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail as sendPasswordResetEmailAction,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '../firebase/auth';
import {
  getEmailVerificationActionCodeSettings,
  getPasswordResetActionCodeSettings,
} from '../firebase/deepLink';
import {
  createUserProfileOnce,
  getUserProfile,
  syncEmailVerifiedStatus,
  updateUserProfile,
} from './user.service';
import { notifyRegistrationSuccess } from './notification.service';
import { stripUndefined } from '../utils/firestoreHelpers';

const getActiveUser = () => {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error('No signed-in user.');
  }
  return user;
};

export const registerWithEmail = async (input: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const auth = getFirebaseAuth();
  const email = input.email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, email, input.password);
  const user = credential.user;

  await updateProfile(user, { displayName: input.fullName.trim() });
  await reload(user);

  const freshUser = auth.currentUser;
  if (!freshUser) {
    throw new Error('Registration failed. Please try again.');
  }

  await createUserProfileOnce({
    uid: freshUser.uid,
    fullName: input.fullName,
    email,
    emailVerified: freshUser.emailVerified,
  });

  await sendEmailVerification(freshUser, getEmailVerificationActionCodeSettings());

  await notifyRegistrationSuccess(input.fullName);

  return freshUser;
};

export const loginWithEmail = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  const normalizedEmail = email.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  const user = credential.user;
  await reload(user);

  const refreshed = auth.currentUser;
  if (refreshed) {
    await createUserProfileOnce({
      uid: refreshed.uid,
      fullName: refreshed.displayName ?? '',
      email: refreshed.email ?? normalizedEmail,
      emailVerified: refreshed.emailVerified,
    });
    await syncEmailVerifiedStatus(refreshed.uid, refreshed.emailVerified);
  }

  const profile = refreshed ? await getUserProfile(refreshed.uid) : null;
  return { user: refreshed ?? user, profile };
};

export const sendPasswordResetEmail = async (email: string) => {
  const auth = getFirebaseAuth();
  const normalizedEmail = email.trim().toLowerCase();
  await sendPasswordResetEmailAction(auth, normalizedEmail, getPasswordResetActionCodeSettings());
};

export const confirmPasswordReset = async (oobCode: string, newPassword: string) => {
  await confirmPasswordResetAction(getFirebaseAuth(), oobCode, newPassword);
};

export const resendEmailVerification = async () => {
  const user = getActiveUser();
  await reload(user);
  const freshUser = getFirebaseAuth().currentUser;
  if (!freshUser) {
    throw new Error('No signed-in user.');
  }
  await sendEmailVerification(freshUser, getEmailVerificationActionCodeSettings());
};

export const refreshAuthUser = async () => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  await reload(user);
  const refreshed = auth.currentUser;
  if (!refreshed) {
    return null;
  }

  await syncEmailVerifiedStatus(refreshed.uid, refreshed.emailVerified);

  return refreshed;
};

export const signOutUser = async () => {
  await signOut(getFirebaseAuth());
};

export const completeUserProfile = async (uid: string, phone?: string) => {
  const trimmedPhone = phone?.trim();
  await updateUserProfile(
    uid,
    stripUndefined({
      ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      profileCompleted: true,
    }),
  );
};
