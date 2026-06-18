import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  college?: string;
  department?: string;
  skills?: string[];
  aboutMe?: string;
  photoUrl?: string;
  fcmToken?: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
  updatedAt?: { seconds: number; nanoseconds: number } | null;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CompleteProfileInput = {
  phone?: string;
};

export type UpdateUserProfileDetailsInput = {
  fullName?: string;
  college?: string;
  department?: string;
  skills?: string[];
  aboutMe?: string;
  photoUrl?: string;
  phone?: string;
};

export type AuthUser = FirebaseAuthTypes.User;

export type AuthRouteTarget =
  | 'Splash'
  | 'Auth'
  | 'EmailVerification'
  | 'CompleteProfile'
  | 'MainTabs';
