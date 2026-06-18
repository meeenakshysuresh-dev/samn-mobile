import React from 'react';
import { StyleSheet } from 'react-native';

import { AppText, Screen, SectionHeading } from '../../components';
import { useAppTheme } from '../../theme/useAppTheme';

export const ProfileScreen = () => {
  const { theme } = useAppTheme();

  return (
    <Screen>
      <SectionHeading title="ACCOUNT" />
      <AppText preset="heading2" style={styles.title}>
        Profile
      </AppText>
      <AppText preset="body" style={{ color: theme.textSecondary }}>
        Your profile details will appear here.
      </AppText>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
});
