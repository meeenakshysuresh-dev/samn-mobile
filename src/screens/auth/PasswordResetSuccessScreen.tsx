import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppIcon, AppText, AppView } from '../../components';
import { brand } from '../../theme/tokens';
import type { AuthStackParamList } from '../../navigation/RootNavigator.types';
import { authStyles } from './authStyles';
import { AuthScreenLayout } from './AuthScreenLayout';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'PasswordResetSuccess'>;

export const PasswordResetSuccessScreen = () => {
  const navigation = useNavigation<Nav>();

  const goToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  };

  return (
    <AuthScreenLayout headerTitle="Password Reset" showBack={false} scrollable={false} centered centerForm={false}>
      <AppView style={authStyles.centeredHeader}>
        <AppView style={authStyles.successIconWrap}>
          <AppIcon name="check" width={40} height={40} color={brand.primary} />
        </AppView>
        <AppText preset="authCardTitle" style={[authStyles.title, { textAlign: 'center' }]}>
          Password Reset Complete
        </AppText>
        <AppText
          preset="authCardSubtitle"
          style={[authStyles.subtitle, { textAlign: 'center', marginTop: 8 }]}
        >
          Your password has been updated successfully. You can now sign in with your new password.
        </AppText>
      </AppView>

      <AppButton
        text="Back to Login"
        preset="primary"
        onPress={goToLogin}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
