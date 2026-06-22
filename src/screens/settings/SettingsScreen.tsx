import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppSwitch, AppText, AppView, CommonHeader, HeaderAppWordmark } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmExitOnBack } from '../../hooks/useConfirmExitOnBack';
import { useUnreadNotificationCount } from '../../hooks/useNotificationStore';
import { useLoaderStore } from '../../hooks/useLoaderStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { navigateToHomeStack, navigateToSettingsStack } from '../../navigation/stackNavigation';
import { useTabBarInset, TAB_BAR_DEFAULT_INSET } from '../../navigation/tabBarLayout';
import type { SettingsStackParamList } from '../../navigation/RootNavigator.types';
import {
  registerDeviceToken,
  requestPushPermission,
} from '../../services/notification.service';
import { useAppTheme } from '../../theme/useAppTheme';
import { SettingsMenuRow } from './SettingsMenuRow';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'Settings'>;

type SettingsRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
};

const SettingsRow = ({ label, description, value, onChange, disabled }: SettingsRowProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={styles.rowText}>
        <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary }}>
          {label}
        </AppText>
        {description ? (
          <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 4 }}>
            {description}
          </AppText>
        ) : null}
      </View>
      <AppSwitch value={value} onChange={onChange} disabled={disabled} />
    </View>
  );
};

export const SettingsScreen = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const { user, userProfile, signOut, authLoading } = useAuth();
  const loader = useLoaderStore();
  const darkModeEnabled = useSettingsStore(state => state.darkModeEnabled);
  const pushNotificationsEnabled = useSettingsStore(state => state.pushNotificationsEnabled);
  const setDarkModeEnabled = useSettingsStore(state => state.setDarkModeEnabled);
  const setPushNotificationsEnabled = useSettingsStore(state => state.setPushNotificationsEnabled);
  const unreadNotificationCount = useUnreadNotificationCount();

  useConfirmExitOnBack();

  const handleSignOut = async () => {
    loader.show();
    try {
      await signOut();
    } catch {
      // surfaced via auth context
    } finally {
      loader.hide();
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    await setPushNotificationsEnabled(enabled);
    if (enabled && user?.uid) {
      const granted = await requestPushPermission();
      if (granted) {
        await registerDeviceToken(user.uid);
      }
    }
  };

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title="Settings"
        showBackButton={false}
        safeArea={false}
        leftContent={<HeaderAppWordmark />}
        rightIcon="bell"
        rightBadgeCount={unreadNotificationCount}
        onRightPress={() => navigateToHomeStack(navigation, 'Notifications')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET) + 24 },
        ]}
      >
        <AppText preset="body" style={{ color: theme.textSecondary, marginBottom: 20 }}>
          Manage your SAMN account and app preferences.
        </AppText>

        <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={[styles.groupTitle, { color: theme.textSecondary }]}>
            Preferences
          </AppText>
          <SettingsRow
            label="Dark Mode"
            description="Use dark theme across the app"
            value={darkModeEnabled}
            onChange={setDarkModeEnabled}
          />
          <SettingsRow
            label="Push Notifications"
            description="Receive alerts for account and profile updates"
            value={pushNotificationsEnabled}
            onChange={handlePushToggle}
          />
        </View>

        <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={[styles.groupTitle, { color: theme.textSecondary }]}>
            General
          </AppText>
          <SettingsMenuRow
            label="About Us"
            description="Learn about SAMN"
            icon="info"
            onPress={() => navigateToSettingsStack(navigation, 'AboutUs')}
            showDivider
          />
          <SettingsMenuRow
            label="Help & Support"
            description="FAQs and contact options"
            icon="help"
            onPress={() => navigateToSettingsStack(navigation, 'HelpSupport')}
            showDivider={false}
          />
        </View>

        <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={[styles.groupTitle, { color: theme.textSecondary }]}>
            Account
          </AppText>
          <View style={styles.accountBlock}>
            <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary }}>
              {userProfile?.fullName || user?.displayName || 'SAMN User'}
            </AppText>
            <AppText preset="body" style={{ color: theme.textSecondary, marginTop: 4 }}>
              {userProfile?.email || user?.email || '—'}
            </AppText>
          </View>
          <Pressable
            style={[styles.signOutButton, { borderColor: theme.border }]}
            onPress={handleSignOut}
            disabled={authLoading}
          >
            <AppText preset="body" weight="semibold" style={{ color: theme.error }}>
              Sign Out
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  group: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  groupTitle: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  accountBlock: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  signOutButton: {
    borderTopWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 16,
  },
  rowText: {
    flex: 1,
  },
});
