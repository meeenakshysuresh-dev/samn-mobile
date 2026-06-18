import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppText, AppView } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import { exitAuthScreen } from '../../navigation/stackNavigation';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { validateEmail } from '../../utils/authValidation';
import { authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<Nav>();
  const { sendPasswordReset, error, clearError, authLoading } = useAuth();
  const loader = useLoaderStore();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    clearError();
    setFieldError(null);

    const validation = validateEmail(email);
    if (!validation.valid) {
      setFieldError(validation.error ?? 'Invalid email.');
      return;
    }

    loader.show();
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch {
      // surfaced via context
    } finally {
      loader.hide();
    }
  };

  return (
    <AuthScreenLayout headerTitle="Forgot Password" showBack onBack={() => exitAuthScreen(navigation)}>
      <AppView style={authStyles.headerBlock}>
        <AppText preset="authCardTitle" style={authStyles.title}>
          Forgot Password?
        </AppText>
        <AppText preset="authCardSubtitle" style={authStyles.subtitle}>
          {sent
            ? `We sent a password reset link to ${email.trim()}. Open the link in your email app to reset your password in SAMN.`
            : 'Enter your email address and we will send you a link to reset your password.'}
        </AppText>
      </AppView>

      {!sent ? (
        <AuthFormField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      ) : null}

      {fieldError ? <AppText style={authStyles.formError}>{fieldError}</AppText> : null}
      {error ? <AppText style={authStyles.formError}>{error}</AppText> : null}
      {sent ? <AppText style={authStyles.formSuccess}>Check your email to continue.</AppText> : null}

      <AppButton
        text={sent ? 'Back to Login' : 'Send Reset Link'}
        preset="primary"
        onPress={sent ? () => navigation.navigate('Login') : handleSend}
        disabled={authLoading}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
