/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthNavigator } from '../screens/auth';
import { CompleteProfileScreen } from '../screens/auth/CompleteProfileScreen';
import { EmailVerificationScreen } from '../screens/auth/EmailVerificationScreen';
import { AuthNavigationBridge, SplashScreen } from '../screens/auth/SplashScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { ChatThreadScreen } from '../screens/chat/ChatThreadScreen';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AboutUsScreen } from '../screens/settings/AboutUsScreen';
import { HelpSupportScreen } from '../screens/settings/HelpSupportScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { UploadDetailsScreen } from '../screens/uploads/UploadDetailsScreen';
import { UploadsScreen } from '../screens/uploads/UploadsScreen';
import { BrowseTasksScreen } from '../screens/tasks/BrowseTasksScreen';
import { EditTaskScreen } from '../screens/tasks/EditTaskScreen';
import { MyTasksScreen } from '../screens/tasks/MyTasksScreen';
import { PostTaskScreen } from '../screens/tasks/PostTaskScreen';
import { TaskDetailsScreen } from '../screens/tasks/TaskDetailsScreen';
import { AppBottomTabBar } from './AppBottomTabBar';
import { TAB_BAR_DEFAULT_INSET, TabBarInsetContext } from './tabBarLayout';
import type {
  ChatStackParamList,
  CreateStackParamList,
  HomeStackParamList,
  MainTabParamList,
  ProfileStackParamList,
  RootStackParamList,
  SettingsStackParamList,
} from './RootNavigator.types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const CreateStack = createNativeStackNavigator<CreateStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
    <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
  </HomeStack.Navigator>
);

const CreateStackNavigator = () => (
  <CreateStack.Navigator initialRouteName="MyTasks" screenOptions={{ headerShown: false }}>
    <CreateStack.Screen name="MyTasks" component={MyTasksScreen} />
    <CreateStack.Screen name="PostTask" component={PostTaskScreen} />
    <CreateStack.Screen name="EditTask" component={EditTaskScreen} />
    <CreateStack.Screen name="BrowseTasks" component={BrowseTasksScreen} />
    <CreateStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    <CreateStack.Screen name="Uploads" component={UploadsScreen} />
  </CreateStack.Navigator>
);

const ChatStackNavigator = () => (
  <ChatStack.Navigator initialRouteName="Chat" screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="Chat" component={ChatScreen} />
    <ChatStack.Screen name="ChatThread" component={ChatThreadScreen} />
  </ChatStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
    <SettingsStack.Screen name="Settings" component={SettingsScreen} />
    <SettingsStack.Screen name="AboutUs" component={AboutUsScreen} />
    <SettingsStack.Screen name="HelpSupport" component={HelpSupportScreen} />
  </SettingsStack.Navigator>
);

const MainTabs = () => {
  const [tabBarInset, setTabBarInset] = useState(TAB_BAR_DEFAULT_INSET);

  const handleTabBarHeightChange = useCallback((height: number) => {
    setTabBarInset(current => (current === height ? current : height));
  }, []);

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => (
      <AppBottomTabBar {...props} onHeightChange={handleTabBarHeightChange} />
    ),
    [handleTabBarHeightChange],
  );

  return (
    <TabBarInsetContext.Provider value={tabBarInset}>
      <Tabs.Navigator
        initialRouteName="HomeStack"
        screenOptions={{ headerShown: false }}
        tabBar={renderTabBar}
      >
        <Tabs.Screen name="CreateStack" component={CreateStackNavigator} options={{ title: 'Task' }} />
        <Tabs.Screen name="ChatStack" component={ChatStackNavigator} options={{ title: 'Chat' }} />
        <Tabs.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
        <Tabs.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
        <Tabs.Screen name="SettingsStack" component={SettingsStackNavigator} options={{ title: 'Settings' }} />
      </Tabs.Navigator>
    </TabBarInsetContext.Provider>
  );
};

export const RootNavigator = () => (
  <>
    <AuthNavigationBridge />
    <RootStack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Splash" component={SplashScreen} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <RootStack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen
        name="UploadDetails"
        component={UploadDetailsScreen}
        options={{ title: 'Upload Details' }}
      />
    </RootStack.Navigator>
  </>
);
