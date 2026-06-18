import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppInput, AppText, AppView } from '../../components';
import type { AuthStackParamList, RootStackParamList } from '../../navigation/RootNavigator.types';
import { authColors, authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<Nav>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreenLayout
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

      <AppButton
        text="Login"
        preset="primary"
        onPress={() =>
          rootNavigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            }),
          )
        }
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
