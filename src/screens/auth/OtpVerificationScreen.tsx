import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { AppButton, AppText, AppView } from '../../components';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { authStyles } from './authStyles';
import { AuthScreenLayout } from './AuthScreenLayout';
import { OTP_LENGTH_CONST, OtpInput } from './OtpInput';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type Route = RouteProp<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const [otp, setOtp] = useState('');
  const email = route.params?.email ?? 'name@example.com';

  return (
    <AuthScreenLayout showBack onBack={() => navigation.goBack()}>
      <AppView style={authStyles.headerBlock}>
        <AppText preset="authCardTitle" style={authStyles.title}>
          Verify OTP
        </AppText>
        <AppText preset="authCardSubtitle" style={authStyles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <AppText preset="authEmailDisplay">{email}</AppText>
        </AppText>
      </AppView>

      <OtpInput value={otp} onChange={setOtp} />

      <AppButton
        text="Verify"
        preset="primary"
        disabled={otp.length < OTP_LENGTH_CONST}
        onPress={() => navigation.navigate('ResetPassword', { email })}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />

      <AppView style={[authStyles.resendRow, authStyles.footerRow]}>
        <AppText style={authStyles.resendText}>Didn&apos;t receive the code? </AppText>
        <Pressable onPress={() => undefined} hitSlop={8}>
          <AppText style={authStyles.resendLink}>Resend</AppText>
        </Pressable>
      </AppView>
    </AuthScreenLayout>
  );
};
