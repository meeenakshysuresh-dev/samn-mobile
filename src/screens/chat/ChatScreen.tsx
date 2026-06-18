import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText, AppView, CommonHeader, Screen, SectionHeading } from '../../components';
import { useConfirmExitOnBack } from '../../hooks/useConfirmExitOnBack';
import { useUnreadNotificationCount } from '../../hooks/useNotificationStore';
import { navigateToHomeStack } from '../../navigation/stackNavigation';
import type { ChatStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';

type Nav = NativeStackNavigationProp<ChatStackParamList, 'Chat'>;

export const ChatScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const unreadNotificationCount = useUnreadNotificationCount();

  useConfirmExitOnBack();

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title="Chat"
        showBackButton={false}
        safeArea={false}
        rightIcon="bell"
        rightBadgeCount={unreadNotificationCount}
        onRightPress={() => navigateToHomeStack(navigation, 'Notifications')}
      />
      <Screen>
        <SectionHeading title="MESSAGES" />
        <AppText preset="body" style={{ color: theme.textSecondary, lineHeight: 22 }}>
          Conversations will appear here.
        </AppText>
      </Screen>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
