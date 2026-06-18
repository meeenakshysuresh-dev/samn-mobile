import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  EmailVerification: undefined;
  CompleteProfile: undefined;
  MainTabs: undefined;
  UploadDetails: {
    uploadId: string;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { oobCode: string };
  PasswordResetSuccess: undefined;
};

export type MainTabParamList = {
  CreateStack: undefined;
  ChatStack: undefined;
  HomeStack: undefined;
  ProfileStack: undefined;
  SettingsStack: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
};

export type CreateStackParamList = {
  Uploads: undefined;
};

export type ChatStackParamList = {
  Chat: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type UploadsStackParamList = CreateStackParamList;

export type SettingsStackParamList = {
  Settings: undefined;
};
