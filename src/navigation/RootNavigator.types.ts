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
  CreateStack: NavigatorScreenParams<CreateStackParamList> | undefined;
  ChatStack: NavigatorScreenParams<ChatStackParamList> | undefined;
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList> | undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
};

export type CreateStackParamList = {
  MyTasks: undefined;
  PostTask: undefined;
  EditTask: {
    taskId: string;
  };
  BrowseTasks: undefined;
  TaskDetails: {
    taskId: string;
  };
  Uploads: undefined;
};

export type ChatStackParamList = {
  Chat: undefined;
  ChatThread: {
    chatRoomId: string;
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type UploadsStackParamList = CreateStackParamList;

export type SettingsStackParamList = {
  Settings: undefined;
  AboutUs: undefined;
  HelpSupport: undefined;
};
