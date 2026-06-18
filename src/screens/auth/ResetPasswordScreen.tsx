import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { AppButton, AppText, AppView } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import { exitAuthScreen } from '../../navigation/stackNavigation';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { validateConfirmPassword, validatePassword } from '../../utils/authValidation';
import { authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = RouteProp<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { resetPassword, error, clearError, authLoading } = useAuth();
  const loader = useLoaderStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const oobCode = route.params?.oobCode ?? '';

  const handleReset = async () => {
    clearError();
    setFieldError(null);

    if (!oobCode) {
      setFieldError('Invalid or expired reset link. Request a new password reset email.');
      return;
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      setFieldError(passwordCheck.error ?? 'Invalid password.');
      return;
    }

    const confirmCheck = validateConfirmPassword(password, confirmPassword);
    if (!confirmCheck.valid) {
      setFieldError(confirmCheck.error ?? 'Passwords do not match.');
      return;
    }

    loader.show();
    try {
      await resetPassword(oobCode, password, confirmPassword);
      navigation.navigate('PasswordResetSuccess');
    } catch {
      // surfaced via context
    } finally {
      loader.hide();
    }
  };

  return (
    <AuthScreenLayout headerTitle="Update Password" showBack onBack={() => exitAuthScreen(navigation)}>
      <AppView style={authStyles.headerBlock}>
        <AppText preset="authCardTitle" style={authStyles.title}>
          Update Password
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

      {fieldError ? <AppText style={authStyles.formError}>{fieldError}</AppText> : null}
      {error ? <AppText style={authStyles.formError}>{error}</AppText> : null}

      <AppButton
        text="Update Password"
        preset="primary"
        onPress={handleReset}
        disabled={authLoading}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
