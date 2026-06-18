import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getCrashlytics, log } from '@react-native-firebase/crashlytics';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppCard, AppText, AppView, DashboardHeader, SectionHeading } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useTabBarInset, TAB_BAR_DEFAULT_INSET } from '../../navigation/tabBarLayout';
import type { HomeStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { getFirstName } from '../../utils/userName';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>;

export const DashboardScreen = () => {
  const { theme, activeScheme } = useAppTheme();
  const network = useNetworkStatus();
  const tabBarInset = useTabBarInset();
  const navigation = useNavigation<Nav>();
  const { userProfile, user } = useAuth();
  const [firebaseAppName, setFirebaseAppName] = useState('default');

  const firstName = getFirstName(userProfile?.fullName ?? user?.displayName);

  useEffect(() => {
    const app = getApp();
    setFirebaseAppName(app.name);
    log(getCrashlytics(), 'Dashboard opened');
  }, []);

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <DashboardHeader
        user={{ name: firstName }}
        onNotification={() => navigation.navigate('Notifications')}
        safeArea={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET) + 16 },
        ]}
      >
        <SectionHeading title="OVERVIEW" />
        <AppText preset="displaySmall" style={styles.title}>
          Task Manager
        </AppText>
        <AppText preset="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
          Android React Native app with shared UI foundation, Firebase, network status, and uploads.
        </AppText>

        <AppCard style={styles.panel}>
          <AppText preset="overline" style={{ color: theme.textSecondary }}>
            Firebase app
          </AppText>
          <AppText preset="heading3" style={{ marginTop: 6 }}>
            {firebaseAppName}
          </AppText>
        </AppCard>

        <AppCard style={styles.panel}>
          <AppText preset="overline" style={{ color: theme.textSecondary }}>
            Network
          </AppText>
          <AppText
            preset="heading3"
            style={{ marginTop: 6, color: network.isConnected ? theme.success : theme.error }}
          >
            {network.isConnected ? 'Online' : 'Offline'} · {network.type}
          </AppText>
        </AppCard>

        <AppCard style={styles.panel}>
          <AppText preset="overline" style={{ color: theme.textSecondary }}>
            Theme
          </AppText>
          <AppText preset="heading3" style={{ marginTop: 6 }}>
            {activeScheme}
          </AppText>
        </AppCard>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    lineHeight: 22,
  },
  panel: {
    marginBottom: 14,
    padding: 16,
  },
});
