import React, { useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppText, AppView } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { validateRegisterForm } from '../../utils/authValidation';
import { authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export const SignUpScreen = () => {
  const navigation = useNavigation<Nav>();
  const { signUp, error, clearError, authLoading } = useAuth();
  const loader = useLoaderStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const handleSignUp = async () => {
    if (submittingRef.current || authLoading) {
      return;
    }

    clearError();
    setFieldError(null);

    const validation = validateRegisterForm({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!validation.valid) {
      setFieldError(validation.error ?? 'Invalid input.');
      return;
    }

    loader.show();
    submittingRef.current = true;
    try {
      await signUp({ fullName, email, password, confirmPassword });
    } catch {
      // surfaced via context
    } finally {
      submittingRef.current = false;
      loader.hide();
    }
  };

  return (
    <AuthScreenLayout
      headerTitle="Sign Up"
      showBack
      onBack={() => navigation.goBack()}
      footer={
        <AppView style={authStyles.footerRow}>
          <AppText style={authStyles.footerText}>Already have an account? </AppText>
          <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
            <AppText style={authStyles.footerLinkPrimary}>Login</AppText>
          </Pressable>
        </AppView>
      }
    >
      <AppView style={authStyles.headerBlockCentered}>
        <AppText preset="authCardTitle" style={authStyles.titleCentered}>
          Create Your Account
        </AppText>
        <AppText preset="authCardSubtitle" style={authStyles.subtitleCentered}>
          Join the SAMN community.
        </AppText>
      </AppView>

      <AuthFormField
        label="Full Name"
        labelStyle={authStyles.fieldLabelUpper}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter your full name"
        autoCapitalize="words"
        autoCorrect={false}
      />

      <AuthFormField
        label="Email Address"
        labelStyle={authStyles.fieldLabelUpper}
        value={email}
        onChangeText={setEmail}
        placeholder="email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AuthFormField
        label="Password"
        labelStyle={authStyles.fieldLabelUpper}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <AuthFormField
        label="Confirm Password"
        labelStyle={authStyles.fieldLabelUpper}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      {fieldError ? <AppText style={authStyles.formError}>{fieldError}</AppText> : null}
      {error ? <AppText style={authStyles.formError}>{error}</AppText> : null}

      <AppButton
        text="Create Account"
        preset="primary"
        onPress={handleSignUp}
        disabled={authLoading}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
