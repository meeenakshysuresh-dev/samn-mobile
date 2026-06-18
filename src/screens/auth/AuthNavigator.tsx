import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { LoginScreen } from './LoginScreen';
import { PasswordResetSuccessScreen } from './PasswordResetSuccessScreen';
import { ResetPasswordScreen } from './ResetPasswordScreen';
import { SignUpScreen } from './SignUpScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
  </Stack.Navigator>
);
