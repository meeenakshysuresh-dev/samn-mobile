/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from '../screens/home/DashboardScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { UploadDetailsScreen } from '../screens/uploads/UploadDetailsScreen';
import { UploadsScreen } from '../screens/uploads/UploadsScreen';
import { useAppTheme } from '../theme/useAppTheme';
import type {
  HomeStackParamList,
  MainTabParamList,
  RootStackParamList,
  SettingsStackParamList,
  UploadsStackParamList,
} from './RootNavigator.types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const UploadsStack = createNativeStackNavigator<UploadsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const getTabIconName = (routeName: keyof MainTabParamList) => {
  if (routeName === 'HomeStack') {
    return 'home';
  }

  if (routeName === 'UploadsStack') {
    return 'upload-cloud';
  }

  return 'settings';
};

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </HomeStack.Navigator>
  );
};

const UploadsStackNavigator = () => {
  return (
    <UploadsStack.Navigator>
      <UploadsStack.Screen
        name="Uploads"
        component={UploadsScreen}
        options={{ title: 'Uploads' }}
      />
    </UploadsStack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </SettingsStack.Navigator>
  );
};

const MainTabs = () => {
  const { colors } = useAppTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          return <Feather name={getTabIconName(route.name)} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="UploadsStack"
        component={UploadsStackNavigator}
        options={{ title: 'Uploads' }}
      />
      <Tabs.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{ title: 'Settings' }}
      />
    </Tabs.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="UploadDetails"
        component={UploadDetailsScreen}
        options={{ title: 'Upload Details' }}
      />
    </RootStack.Navigator>
  );
};
