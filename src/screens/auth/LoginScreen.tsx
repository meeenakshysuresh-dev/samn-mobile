import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppInput, AppText, AppView } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { validateLoginForm } from '../../utils/authValidation';
import { authColors, authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<Nav>();
  const { signIn, error, clearError, authLoading } = useAuth();
  const loader = useLoaderStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleLogin = async () => {
    clearError();
    setFieldError(null);

    const validation = validateLoginForm({ email, password });
    if (!validation.valid) {
      setFieldError(validation.error ?? 'Invalid input.');
      return;
    }

    loader.show();
    try {
      await signIn({ email, password });
    } catch {
      // surfaced via context
    } finally {
      loader.hide();
    }
  };

  return (
    <AuthScreenLayout
      headerTitle="Login"
      showBack={false}
      footer={
        <AppView style={authStyles.footerRow}>
          <AppText style={authStyles.footerText}>Don&apos;t have an account? </AppText>
          <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
            <AppText style={authStyles.footerLinkPrimary}>Create Account</AppText>
          </Pressable>
        </AppView>
      }
    >
      <AppView style={authStyles.headerBlock}>
        <AppText preset="authCardTitle" style={authStyles.title}>
          Welcome Back
        </AppText>
        <AppText preset="authCardSubtitle" style={authStyles.subtitle}>
          Sign in to continue helping people nearby.
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

      <AppView style={authStyles.fieldSpacing}>
        <AppText style={authStyles.fieldLabel}>Password</AppText>
        <AppInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          inputWrapperStyle={authStyles.inputWrapper}
          style={authStyles.inputText}
          placeholderTextColor={authColors.inputPlaceholder}
          containerStyle={{ marginBottom: 0 }}
        />
        <Pressable
          onPress={() => navigation.navigate('ForgotPassword')}
          hitSlop={8}
          style={authStyles.forgotLinkRow}
        >
          <AppText style={authStyles.forgotLink}>Forgot password?</AppText>
        </Pressable>
      </AppView>

      {fieldError ? <AppText style={authStyles.formError}>{fieldError}</AppText> : null}
      {error ? <AppText style={authStyles.formError}>{error}</AppText> : null}

      <AppButton
        text="Login"
        preset="primary"
        onPress={handleLogin}
        disabled={authLoading}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
