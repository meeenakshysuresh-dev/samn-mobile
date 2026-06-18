import React, { useState } from 'react';

import { AppButton, AppText, AppView } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { validateFullName } from '../../utils/authValidation';
import { authStyles } from './authStyles';
import { AuthFormField } from './AuthFormField';
import { AuthScreenLayout } from './AuthScreenLayout';

export const CompleteProfileScreen = () => {
  const { user, userProfile, error, clearError, completeProfile, authLoading } = useAuth();
  const [phone, setPhone] = useState(userProfile?.phone ?? '');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleComplete = async () => {
    clearError();
    setFieldError(null);

    const nameCheck = validateFullName(userProfile?.fullName ?? user?.displayName ?? '');
    if (!nameCheck.valid) {
      setFieldError(nameCheck.error ?? 'Profile incomplete.');
      return;
    }

    try {
      await completeProfile(phone);
    } catch {
      // error via context
    }
  };

  return (
    <AuthScreenLayout headerTitle="Complete Profile" showBack={false} centerForm={false}>
      <AppView style={authStyles.headerBlock}>
        <AppText preset="authCardTitle" style={authStyles.title}>
          Complete Your Profile
        </AppText>
        <AppText preset="authCardSubtitle" style={authStyles.subtitle}>
          Add a few details to finish setting up your SAMN account.
        </AppText>
      </AppView>

      <AuthFormField
        label="Full Name"
        value={userProfile?.fullName ?? user?.displayName ?? ''}
        editable={false}
        placeholder="Your name"
      />

      <AuthFormField
        label="Phone Number (optional)"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      {fieldError ? <AppText style={authStyles.formError}>{fieldError}</AppText> : null}
      {error ? <AppText style={authStyles.formError}>{error}</AppText> : null}

      <AppButton
        text="Continue to Dashboard"
        preset="primary"
        onPress={handleComplete}
        disabled={authLoading}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />
    </AuthScreenLayout>
  );
};
