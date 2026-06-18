import React from 'react';
import { StyleSheet } from 'react-native';

import { AppText, Screen, SectionHeading } from '../../components';
import { useAppTheme } from '../../theme/useAppTheme';

export const ChatScreen = () => {
  const { theme } = useAppTheme();

  return (
    <Screen>
      <SectionHeading title="MESSAGES" />
      <AppText preset="heading2" style={styles.title}>
        Chat
      </AppText>
      <AppText preset="body" style={{ color: theme.textSecondary }}>
        Conversations will appear here.
      </AppText>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
});
