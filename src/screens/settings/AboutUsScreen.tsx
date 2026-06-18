import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppCard, AppLogo, AppText, AppView, CommonHeader } from '../../components';
import {
  APP_DESCRIPTION,
  APP_DISPLAY_NAME,
  APP_MISSION,
  APP_SHORT_NAME,
  APP_VERSION,
  COPYRIGHT,
  SUPPORT_EMAIL,
  WEBSITE_LABEL,
  WEBSITE_URL,
} from '../../constants/appInfo';
import { exitSettingsStackScreen } from '../../navigation/stackNavigation';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import type { SettingsStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { brand, spacing } from '../../theme/tokens';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'AboutUs'>;

export const AboutUsScreen = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();

  const openEmail = () => {
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  const openWebsite = () => {
    void Linking.openURL(WEBSITE_URL);
  };

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader title="About Us" onBack={() => exitSettingsStackScreen(navigation)} safeArea={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 24 }]}
      >
        <View style={styles.logoSection}>
          <AppLogo size={132} />
          <AppText preset="heading2" style={{ color: theme.textPrimary, marginTop: spacing.lg, textAlign: 'center' }}>
            {APP_DISPLAY_NAME}
          </AppText>
          <AppText preset="body" weight="semibold" style={{ color: brand.primary, marginTop: 4 }}>
            ({APP_SHORT_NAME})
          </AppText>
          <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 8 }}>
            Version {APP_VERSION}
          </AppText>
        </View>

        <AppCard style={styles.card}>
          <AppText preset="overline" style={{ color: theme.textSecondary }}>
            About
          </AppText>
          <AppText preset="body" style={[styles.bodyText, { color: theme.textPrimary }]}>
            {APP_DESCRIPTION}
          </AppText>
        </AppCard>

        <AppCard style={styles.card}>
          <AppText preset="overline" style={{ color: theme.textSecondary }}>
            Our Mission
          </AppText>
          <AppText preset="body" style={[styles.bodyText, { color: theme.textPrimary }]}>
            {APP_MISSION}
          </AppText>
        </AppCard>

        <AppCard style={styles.card}>
          <AppText preset="overline" style={{ color: theme.textSecondary }}>
            Contact
          </AppText>
          <Pressable onPress={openEmail} style={styles.linkRow}>
            <AppText preset="body" style={{ color: theme.textSecondary }}>
              Email:{' '}
            </AppText>
            <AppText preset="body" weight="semibold" style={{ color: brand.primary }}>
              {SUPPORT_EMAIL}
            </AppText>
          </Pressable>
          <Pressable onPress={openWebsite} style={[styles.linkRow, { marginTop: spacing.sm }]}>
            <AppText preset="body" style={{ color: theme.textSecondary }}>
              Website:{' '}
            </AppText>
            <AppText preset="body" weight="semibold" style={{ color: brand.primary }}>
              {WEBSITE_LABEL}
            </AppText>
          </Pressable>
        </AppCard>

        <AppText preset="caption" style={[styles.copyright, { color: theme.textMuted }]}>
          {COPYRIGHT}
        </AppText>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    padding: 16,
    marginBottom: spacing.lg,
  },
  bodyText: {
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  copyright: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
