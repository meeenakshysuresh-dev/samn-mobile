/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthNavigator } from '../screens/auth';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { DashboardScreen } from '../screens/home/DashboardScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { UploadDetailsScreen } from '../screens/uploads/UploadDetailsScreen';
import { UploadsScreen } from '../screens/uploads/UploadsScreen';
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
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
  </HomeStack.Navigator>
);

const CreateStackNavigator = () => (
  <CreateStack.Navigator screenOptions={{ headerShown: false }}>
    <CreateStack.Screen name="Uploads" component={UploadsScreen} />
  </CreateStack.Navigator>
);

const ChatStackNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="Chat" component={ChatScreen} />
  </ChatStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
    <SettingsStack.Screen name="Settings" component={SettingsScreen} />
  </SettingsStack.Navigator>
);

const MainTabs = () => {
  const [tabBarInset, setTabBarInset] = useState(TAB_BAR_DEFAULT_INSET);

  return (
    <TabBarInsetContext.Provider value={tabBarInset}>
      <Tabs.Navigator
        initialRouteName="HomeStack"
        screenOptions={{ headerShown: false }}
        tabBar={props => <AppBottomTabBar {...props} onHeightChange={setTabBarInset} />}
      >
        <Tabs.Screen name="CreateStack" component={CreateStackNavigator} options={{ title: 'Create' }} />
        <Tabs.Screen name="ChatStack" component={ChatStackNavigator} options={{ title: 'Chat' }} />
        <Tabs.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'Home' }} />
        <Tabs.Screen name="ProfileStack" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
        <Tabs.Screen name="SettingsStack" component={SettingsStackNavigator} options={{ title: 'Settings' }} />
      </Tabs.Navigator>
    </TabBarInsetContext.Provider>
  );
};

export const RootNavigator = () => (
  <RootStack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Auth" component={AuthNavigator} />
    <RootStack.Screen name="MainTabs" component={MainTabs} />
    <RootStack.Screen name="UploadDetails" component={UploadDetailsScreen} options={{ title: 'Upload Details' }} />
  </RootStack.Navigator>
);
