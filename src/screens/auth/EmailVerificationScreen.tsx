import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { AppButton, AppIcon, AppText, AppView } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import { brand } from '../../theme/tokens';
import { authStyles } from './authStyles';
import { AuthScreenLayout } from './AuthScreenLayout';

const POLL_INTERVAL_MS = 5000;
const RESEND_COOLDOWN_MS = 60000;

const VERIFY_STEPS = [
  'Open the verification email from SAMN in your inbox.',
  'Tap the verification link in the email.',
  'Return here and tap "I\'ve Verified My Email" to continue.',
];

export const EmailVerificationScreen = () => {
  const {
    user,
    error,
    clearError,
    resendVerificationEmail,
    checkEmailVerified,
    signOut,
    authLoading,
  } = useAuth();
  const loader = useLoaderStore();
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      checkEmailVerified().catch(() => undefined);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [checkEmailVerified]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown(current => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) {
      return;
    }

    clearError();
    setLocalMessage(null);
    try {
      await resendVerificationEmail();
      setLocalMessage('Verification email sent. Check your inbox and spam folder.');
      setResendCooldown(RESEND_COOLDOWN_MS / 1000);
    } catch {
      // error surfaced via context
    }
  };

  const handleContinue = async () => {
    clearError();
    setLocalMessage(null);
    const verified = await checkEmailVerified();
    if (!verified) {
      setLocalMessage('Email not verified yet. Open the link in your email, then try again.');
    }
  };

  const handleSignOut = async () => {
    loader.show();
    try {
      await signOut();
    } catch {
      // error surfaced via context
    } finally {
      loader.hide();
    }
  };

  return (
    <AuthScreenLayout headerTitle="Email Verification" showBack={false} scrollable centered centerForm={false}>
      <AppView style={authStyles.centeredHeader}>
        <AppView style={authStyles.successIconWrap}>
          <AppIcon name="mail" width={40} height={40} color={brand.primary} />
        </AppView>
        <AppText preset="authCardTitle" style={[authStyles.title, { textAlign: 'center' }]}>
          Verify Your Email
        </AppText>
        <AppText
          preset="authCardSubtitle"
          style={[authStyles.subtitle, { textAlign: 'center', marginTop: 8 }]}
        >
          We sent a secure verification link to the email below.
        </AppText>
      </AppView>

      <AppView style={authStyles.verifyEmailCard}>
        <AppText style={authStyles.verifyEmailLabel}>Email Address</AppText>
        <AppText style={authStyles.verifyEmailValue}>{user?.email ?? 'your email'}</AppText>
      </AppView>

      <AppView style={authStyles.verifyStepsCard}>
        {VERIFY_STEPS.map((step, index) => (
          <AppView key={step} style={authStyles.verifyStepRow}>
            <AppView style={authStyles.verifyStepBadge}>
              <AppText style={authStyles.verifyStepBadgeText}>{index + 1}</AppText>
            </AppView>
            <AppText style={authStyles.verifyStepText}>{step}</AppText>
          </AppView>
        ))}
      </AppView>

      <AppText style={authStyles.verifyHint}>
        Did not receive it? Check spam or promotions, then use Resend below.
      </AppText>

      {error ? <AppText style={authStyles.formError}>{error}</AppText> : null}
      {localMessage ? <AppText style={authStyles.formSuccess}>{localMessage}</AppText> : null}

      <AppButton
        text="I've Verified My Email"
        preset="primary"
        onPress={handleContinue}
        disabled={authLoading}
        style={authStyles.primaryButton}
        labelPreset="authButtonLabel"
        textWeight="semibold"
      />

      <AppView style={[authStyles.resendRow, { marginTop: 20 }]}>
        <AppText style={authStyles.resendText}>Didn&apos;t receive the email? </AppText>
        <Pressable onPress={handleResend} hitSlop={8} disabled={authLoading || resendCooldown > 0}>
          <AppText style={authStyles.resendLink}>
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
          </AppText>
        </Pressable>
      </AppView>

      <AppView style={[authStyles.footerRow, { marginTop: 24 }]}>
        <AppText style={authStyles.footerText}>Wrong email? </AppText>
        <Pressable onPress={handleSignOut} hitSlop={8} disabled={authLoading}>
          <AppText style={authStyles.footerLinkPrimary}>Sign out</AppText>
        </Pressable>
      </AppView>
    </AuthScreenLayout>
  );
};
