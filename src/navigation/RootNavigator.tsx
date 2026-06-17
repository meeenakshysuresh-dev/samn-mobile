import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CameraScreen } from '../screens/CameraScreen';
import { HomeScreen } from '../screens/HomeScreen';
import type { RootStackParamList } from './RootNavigator.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Task Manager' }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Camera' }}
      />
    </Stack.Navigator>
  );
};
