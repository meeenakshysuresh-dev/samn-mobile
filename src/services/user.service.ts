import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  query,
  setDoc,
  where,
} from '@react-native-firebase/firestore';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { FIRESTORE_COLLECTIONS } from '../firebase/config';
import { serverTimestamp, userDocument } from '../firebase/firestore';
import type { UpdateUserProfileDetailsInput, UserProfile } from '../types/auth.types';

export type CreateUserProfileInput = {
  uid: string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
};

const isPermissionDenied = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  return code === 'firestore/permission-denied';
};

const usersCollection = () => collection(getFirestore(), FIRESTORE_COLLECTIONS.users);

const buildProfilePayload = (input: CreateUserProfileInput) => ({
  uid: input.uid,
  fullName: input.fullName.trim(),
  email: input.email.trim().toLowerCase(),
  emailVerified: input.emailVerified ?? false,
  profileCompleted: false,
  role: 'user' as const,
  status: 'active' as const,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const removeStaleProfilesForEmail = async (email: string, activeUid: string): Promise<void> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const snapshot = await getDocs(
      query(usersCollection(), where('email', '==', normalizedEmail), limit(10)),
    );

    await Promise.all(
      snapshot.docs
        .filter(docSnap => docSnap.id !== activeUid)
        .map(docSnap => deleteDoc(docSnap.ref)),
    );
  } catch (error) {
    if (!isPermissionDenied(error)) {
      throw error;
    }
  }
};

export const createUserProfileOnce = async (input: CreateUserProfileInput): Promise<void> => {
  const normalizedEmail = input.email.trim().toLowerCase();
  const profileRef = userDocument(input.uid);
  const existing = await getDoc(profileRef);

  if (existing.exists()) {
    return;
  }

  await removeStaleProfilesForEmail(normalizedEmail, input.uid);
  await setDoc(profileRef, buildProfilePayload(input));
};

/** @deprecated Use createUserProfileOnce */
export const createUserProfile = createUserProfileOnce;

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const snapshot = await getDoc(userDocument(uid));
    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as UserProfile;
  } catch (error) {
    if (isPermissionDenied(error)) {
      return null;
    }
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<
    Pick<
      UserProfile,
      | 'fullName'
      | 'phone'
      | 'profileCompleted'
      | 'emailVerified'
      | 'college'
      | 'department'
      | 'skills'
      | 'aboutMe'
      | 'photoUrl'
      | 'fcmToken'
    >
  >,
): Promise<void> => {
  const existing = await getUserProfile(uid);
  if (!existing) {
    return;
  }

  await setDoc(
    userDocument(uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const syncEmailVerifiedStatus = async (
  uid: string,
  emailVerified: boolean,
): Promise<void> => {
  try {
    const existing = await getUserProfile(uid);
    if (!existing || existing.emailVerified === emailVerified) {
      return;
    }

    await setDoc(
      userDocument(uid),
      {
        emailVerified,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    if (!isPermissionDenied(error)) {
      throw error;
    }
  }
};

export const ensureUserProfile = createUserProfileOnce;

export const subscribeToUserProfile = (
  uid: string,
  onNext: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
) => {
  return onSnapshot(
    userDocument(uid),
    snapshot => {
      if (!snapshot.exists()) {
        onNext(null);
        return;
      }
      onNext(snapshot.data() as UserProfile);
    },
    error => {
      if (isPermissionDenied(error)) {
        onNext(null);
        return;
      }
      onError?.(error);
    },
  );
};

export const mapFirestoreUser = (
  data: FirebaseFirestoreTypes.DocumentData | undefined,
): UserProfile | null => {
  if (!data) {
    return null;
  }

  return data as UserProfile;
};

export const saveUserProfileDetails = async (
  uid: string,
  data: UpdateUserProfileDetailsInput,
): Promise<void> => {
  const existing = await getUserProfile(uid);
  if (!existing) {
    return;
  }

  await setDoc(
    userDocument(uid),
    {
      ...data,
      profileCompleted: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
