import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppText, AppView } from '../../components';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<Nav>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <AuthScreenLayout showBack onBack={() => navigation.goBack()}>
      <AppView style={authStyles.headerBlock}>
        <AppText preset="authCardTitle" style={authStyles.title}>
          Reset Password
        </AppText>
        <AppText preset="authCardSubtitle" style={authStyles.subtitle}>
          Create a new password for your account. Make sure it&apos;s at least 8 characters.
        </AppText>
      </AppView>

      <AuthFormField
        label="New Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <AuthFormField
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <AppButton
        text="Reset Password"
        preset="primary"
        onPress={() => navigation.navigate('PasswordResetSuccess')}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
