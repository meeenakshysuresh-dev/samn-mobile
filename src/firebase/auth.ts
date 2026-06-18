import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged as onAuthStateChangedModular,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';

export type { FirebaseAuthTypes };

export const getFirebaseAuth = () => getAuth();

export const getCurrentUser = (): FirebaseAuthTypes.User | null => getAuth().currentUser;

export const onAuthStateChanged = (
  listener: (user: FirebaseAuthTypes.User | null) => void,
) => onAuthStateChangedModular(getAuth(), listener);

export {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
};
