import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppText, AppView } from '../../components';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');

  return (
    <AuthScreenLayout showBack onBack={() => navigation.goBack()}>
      <AppView style={authStyles.headerBlock}>
        <AppText preset="authCardTitle" style={authStyles.title}>
          Forgot Password?
        </AppText>
        <AppText preset="authCardSubtitle" style={authStyles.subtitle}>
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </AppText>
      </AppView>

      <AuthFormField
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AppButton
        text="Send Verification Code"
        preset="primary"
        onPress={() => navigation.navigate('OtpVerification', { email: email || 'name@example.com' })}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
