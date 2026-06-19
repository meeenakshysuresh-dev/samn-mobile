import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppCard, AppText, AppView, CommonHeader } from '../../components';
import { NOTIFICATION_EVENT_LABELS } from '../../constants/tasks';
import { useAuth } from '../../hooks/useAuth';
import {
  useNotificationItems,
  useUnreadNotificationCount,
} from '../../hooks/useNotificationStore';
import { markNotificationRead, markNotificationsRead } from '../../hooks/useNotificationSync';
import { exitHomeStackScreen } from '../../navigation/stackNavigation';
import { openChatThread } from '../../navigation/navigationRef';
import { navigateToCreateStack } from '../../navigation/taskNavigation';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import type { HomeStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { brand, spacing } from '../../theme/tokens';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Notifications'>;

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const NotificationsScreen = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const { user } = useAuth();
  const allItems = useNotificationItems();
  const unreadCount = useUnreadNotificationCount();

  const items = useMemo(
    () => [...allItems].sort((a, b) => b.createdAt - a.createdAt),
    [allItems],
  );

  const handlePressNotification = (
    notificationId: string,
    taskId?: string,
    read?: boolean,
    chatRoomId?: string,
    type?: string,
  ) => {
    if (!read) {
      void markNotificationRead(user?.uid ?? null, notificationId);
    }
    if (type === 'chat' && chatRoomId) {
      openChatThread(chatRoomId);
      return;
    }
    if (taskId) {
      navigateToCreateStack(navigation, 'TaskDetails', { taskId });
    }
  };

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader title="Notifications" onBack={() => exitHomeStackScreen(navigation)} safeArea={false} />

      <View style={styles.toolbar}>
        <AppText preset="body" style={{ color: theme.textSecondary }}>
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        </AppText>
        {unreadCount > 0 ? (
          <AppButton
            text="Mark all read"
            preset="inline"
            compact
            onPress={() => void markNotificationsRead(user?.uid ?? null)}
          />
        ) : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: tabBarInset + 24 }]}
        ListEmptyComponent={
          <AppCard style={styles.emptyCard}>
            <AppText preset="heading3" style={{ color: theme.textPrimary }}>
              No notifications yet
            </AppText>
            <AppText preset="body" style={{ color: theme.textSecondary, marginTop: 8 }}>
              Task updates are saved in Firestore and will appear here with read/unread status.
            </AppText>
          </AppCard>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              handlePressNotification(item.id, item.taskId, item.read, item.chatRoomId, item.type)
            }
          >
            <AppCard
              style={[
                styles.itemCard,
                !item.read
                  ? { borderColor: brand.primary, backgroundColor: theme.surfaceSecondary }
                  : { borderColor: theme.border },
              ]}
            >
              <AppView style={styles.itemHeader}>
                <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary, flex: 1 }}>
                  {item.title}
                </AppText>
                {!item.read ? (
                  <AppView style={styles.unreadBadge}>
                    <AppText preset="caption" weight="semibold" style={{ color: brand.onPrimary }}>
                      New
                    </AppText>
                  </AppView>
                ) : (
                  <AppText preset="caption" style={{ color: theme.textMuted }}>
                    Read
                  </AppText>
                )}
              </AppView>
              <AppText preset="body" style={{ color: theme.textSecondary, marginTop: 6 }}>
                {item.body}
              </AppText>
              <AppView style={styles.metaRow}>
                <AppText preset="caption" style={{ color: theme.textMuted }}>
                  {formatTime(item.createdAt)}
                </AppText>
                {item.type === 'task' && item.eventType ? (
                  <AppText preset="caption" style={{ color: theme.textMuted }}>
                    {NOTIFICATION_EVENT_LABELS[item.eventType]}
                  </AppText>
                ) : null}
                {item.type === 'chat' ? (
                  <AppText preset="caption" style={{ color: theme.textMuted }}>
                    Chat message
                  </AppText>
                ) : null}
              </AppView>
            </AppCard>
          </Pressable>
        )}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyCard: {
    padding: 20,
  },
  itemCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBadge: {
    backgroundColor: brand.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: spacing.sm,
  },
});
