import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Linking } from 'react-native';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { getFirebaseAuth, onAuthStateChanged, updateProfile } from '../firebase/auth';
import { isPasswordResetLink, parseAuthDeepLink } from '../firebase/deepLink';
import { navigateToResetPassword } from '../navigation/navigationRef';
import {
  completeUserProfile,
  confirmPasswordReset,
  loginWithEmail,
  refreshAuthUser,
  registerWithEmail,
  resendEmailVerification,
  sendPasswordResetEmail,
  signOutUser,
} from '../services/auth.service';
import { getUserProfile, saveUserProfileDetails, subscribeToUserProfile } from '../services/user.service';
import { notifyProfileUpdated } from '../services/notification.service';
import type { AuthRouteTarget, LoginInput, RegisterInput, UpdateUserProfileDetailsInput, UserProfile } from '../types/auth.types';
import { getFirebaseAuthErrorMessage } from '../utils/authErrors';

type AuthContextValue = {
  user: FirebaseAuthTypes.User | null;
  userProfile: UserProfile | null;
  initializing: boolean;
  authLoading: boolean;
  error: string | null;
  pendingResetCode: string | null;
  clearError: () => void;
  clearPendingResetCode: () => void;
  signUp: (input: RegisterInput) => Promise<void>;
  signIn: (input: LoginInput) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resetPassword: (oobCode: string, password: string, confirmPassword: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  completeProfile: (phone?: string) => Promise<void>;
  saveProfileDetails: (input: UpdateUserProfileDetailsInput) => Promise<void>;
  resolveAuthRoute: () => AuthRouteTarget;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const handleIncomingUrl = (
  url: string | null,
  setPendingResetCode: (code: string | null) => void,
) => {
  if (!url || !isPasswordResetLink(url)) {
    return;
  }

  const parsed = parseAuthDeepLink(url);
  if (parsed?.oobCode) {
    setPendingResetCode(parsed.oobCode);
    navigateToResetPassword(parsed.oobCode);
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingResetCode, setPendingResetCode] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearPendingResetCode = useCallback(() => setPendingResetCode(null), []);

  const resolveAuthRoute = useCallback((): AuthRouteTarget => {
    if (initializing) {
      return 'Splash';
    }
    if (!user) {
      return 'Auth';
    }
    if (!user.emailVerified) {
      return 'EmailVerification';
    }
    if (!userProfile?.profileCompleted) {
      return 'CompleteProfile';
    }
    return 'MainTabs';
  }, [initializing, user, userProfile?.profileCompleted]);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | undefined;
    let isMounted = true;

    const initTimeout = setTimeout(() => {
      if (isMounted) {
        setInitializing(false);
      }
    }, 8000);

    const authUnsubscribe = onAuthStateChanged(async firebaseUser => {
      profileUnsubscribe?.();
      profileUnsubscribe = undefined;

      setUser(firebaseUser);
      setUserProfile(null);
      setInitializing(false);
      clearTimeout(initTimeout);

      if (!firebaseUser) {
        return;
      }

      try {
        const profile = await getUserProfile(firebaseUser.uid);
        if (!isMounted) {
          return;
        }
        setUserProfile(profile);

        profileUnsubscribe = subscribeToUserProfile(
          firebaseUser.uid,
          setUserProfile,
          () => undefined,
        );
      } catch {
        // Firestore may be unavailable before Firebase is fully configured.
      }
    });

    Linking.getInitialURL().then(url => handleIncomingUrl(url, setPendingResetCode));
    const linkSubscription = Linking.addEventListener('url', ({ url }) =>
      handleIncomingUrl(url, setPendingResetCode),
    );

    return () => {
      isMounted = false;
      clearTimeout(initTimeout);
      authUnsubscribe();
      profileUnsubscribe?.();
      linkSubscription.remove();
    };
  }, []);

  const runAuthAction = useCallback(async (action: () => Promise<void>) => {
    setAuthLoading(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const signUp = useCallback(
    async (input: RegisterInput) => {
      await runAuthAction(async () => {
        await registerWithEmail({
          fullName: input.fullName,
          email: input.email,
          password: input.password,
        });
      });
    },
    [runAuthAction],
  );

  const signIn = useCallback(
    async (input: LoginInput) => {
      await runAuthAction(async () => {
        const result = await loginWithEmail(input.email, input.password);
        setUser(result.user);
        setUserProfile(result.profile);
      });
    },
    [runAuthAction],
  );

  const signOut = useCallback(async () => {
    await runAuthAction(async () => {
      await signOutUser();
      setUser(null);
      setUserProfile(null);
    });
  }, [runAuthAction]);

  const sendPasswordReset = useCallback(
    async (email: string) => {
      await runAuthAction(async () => {
        await sendPasswordResetEmail(email);
      });
    },
    [runAuthAction],
  );

  const resetPassword = useCallback(
    async (oobCode: string, password: string, confirmPassword: string) => {
      if (password !== confirmPassword) {
        const mismatch = 'Passwords do not match.';
        setError(mismatch);
        throw new Error(mismatch);
      }

      await runAuthAction(async () => {
        await confirmPasswordReset(oobCode, password);
      });
    },
    [runAuthAction],
  );

  const resendVerificationEmail = useCallback(async () => {
    await runAuthAction(async () => {
      await resendEmailVerification();
    });
  }, [runAuthAction]);

  const checkEmailVerified = useCallback(async () => {
    try {
      const refreshed = await refreshAuthUser();
      if (refreshed) {
        setUser(refreshed);
        const profile = await getUserProfile(refreshed.uid);
        if (profile) {
          setUserProfile(profile);
        }
        return refreshed.emailVerified;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const completeProfile = useCallback(
    async (phone?: string) => {
      if (!user) {
        return;
      }
      await runAuthAction(async () => {
        await completeUserProfile(user.uid, phone);
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      });
    },
    [runAuthAction, user],
  );

  const saveProfileDetails = useCallback(
    async (input: UpdateUserProfileDetailsInput) => {
      if (!user) {
        return;
      }

      await runAuthAction(async () => {
        if (input.fullName?.trim()) {
          await updateProfile(user, { displayName: input.fullName.trim() });
        }

        await saveUserProfileDetails(user.uid, input);
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        await notifyProfileUpdated();
      });
    },
    [runAuthAction, user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userProfile,
      initializing,
      authLoading,
      error,
      pendingResetCode,
      clearError,
      clearPendingResetCode,
      signUp,
      signIn,
      signOut,
      sendPasswordReset,
      resetPassword,
      resendVerificationEmail,
      checkEmailVerified,
      completeProfile,
      saveProfileDetails,
      resolveAuthRoute,
    }),
    [
      user,
      userProfile,
      initializing,
      authLoading,
      error,
      pendingResetCode,
      clearError,
      clearPendingResetCode,
      signUp,
      signIn,
      signOut,
      sendPasswordReset,
      resetPassword,
      resendVerificationEmail,
      checkEmailVerified,
      completeProfile,
      saveProfileDetails,
      resolveAuthRoute,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
