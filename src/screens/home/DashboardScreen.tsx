import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getCrashlytics, log } from '@react-native-firebase/crashlytics';

import { Screen } from '../../components/Screen';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useAppTheme } from '../../theme/useAppTheme';

export const DashboardScreen = () => {
  const { colors, activeScheme } = useAppTheme();
  const network = useNetworkStatus();
  const [firebaseAppName, setFirebaseAppName] = useState('default');

  useEffect(() => {
    const app = getApp();
    setFirebaseAppName(app.name);
    log(getCrashlytics(), 'Dashboard opened');
  }, []);

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Task Manager</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Android-only React Native setup with Firebase, theming, network status,
        and uploads.
      </Text>

      <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Firebase app</Text>
        <Text style={[styles.value, { color: colors.text }]}>{firebaseAppName}</Text>
      </View>

      <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Network</Text>
        <Text style={[styles.value, { color: network.isConnected ? colors.success : colors.danger }]}>
          {network.isConnected ? 'Online' : 'Offline'} · {network.type}
        </Text>
      </View>

      <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.mutedText }]}>Theme</Text>
        <Text style={[styles.value, { color: colors.text }]}>{activeScheme}</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 22,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
  },
});
