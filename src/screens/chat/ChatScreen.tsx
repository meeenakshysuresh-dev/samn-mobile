import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText, AppView, CommonHeader, HeaderAppWordmark } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmExitOnBack } from '../../hooks/useConfirmExitOnBack';
import { useChatRooms } from '../../hooks/useChats';
import { useUnreadNotificationCount } from '../../hooks/useNotificationStore';
import { navigateToChatThread, navigateToHomeStack } from '../../navigation/stackNavigation';
import { useTabBarInset, TAB_BAR_DEFAULT_INSET } from '../../navigation/tabBarLayout';
import type { ChatStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/tokens';
import type { ChatListItem } from '../../types/chat.types';
import { ChatListItemRow } from './components/ChatListItemRow';

type Nav = NativeStackNavigationProp<ChatStackParamList, 'Chat'>;

export const ChatScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const tabBarInset = useTabBarInset();
  const { user } = useAuth();
  const userId = user?.uid ?? 'guest-user';
  const unreadNotificationCount = useUnreadNotificationCount();
  const { chatList, loading, error } = useChatRooms(userId);

  useConfirmExitOnBack();

  const openThread = useCallback(
    (chatRoomId: string) => {
      navigateToChatThread(navigation, chatRoomId);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatListItem }) => (
      <ChatListItemRow item={item} onPress={() => openThread(item.chatRoomId)} />
    ),
    [openThread],
  );

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title="Chat"
        showBackButton={false}
        safeArea={false}
        leftContent={<HeaderAppWordmark />}
        rightIcon="bell"
        rightBadgeCount={unreadNotificationCount}
        onRightPress={() => navigateToHomeStack(navigation, 'Notifications')}
      />

      {error ? (
        <View style={{ paddingHorizontal: 20, paddingTop: spacing.sm }}>
          <AppText preset="bodySmall" style={{ color: theme.error }}>
            {error}
          </AppText>
          {error.includes('Firestore rules') ? (
            <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: spacing.xs, lineHeight: 18 }}>
              Accepted tasks still appear below. Publish the latest firestore.rules in Firebase Console, then reload.
            </AppText>
          ) : null}
        </View>
      ) : null}

      {loading && chatList.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={chatList}
          keyExtractor={item => item.chatRoomId}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => undefined} tintColor={theme.primary} />
          }
          contentContainerStyle={[
            chatList.length === 0 && styles.emptyList,
            { paddingBottom: Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET) + 24 },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <AppText preset="heading2" style={{ color: theme.textPrimary, marginBottom: spacing.sm }}>
                No conversations yet
              </AppText>
              <AppText preset="body" style={{ color: theme.textSecondary, textAlign: 'center', lineHeight: 22 }}>
                When you accept a task or someone accepts yours, a chat room will appear here automatically.
              </AppText>
            </View>
          }
        />
      )}
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
});
