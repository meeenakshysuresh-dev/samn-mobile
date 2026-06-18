import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppCard, AppText, AppView, CommonHeader } from '../../components';
import { useNotificationStore } from '../../hooks/useNotificationStore';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import type { HomeStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { brand } from '../../theme/tokens';

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
  const items = useNotificationStore(state => state.items);
  const markAllRead = useNotificationStore(state => state.markAllRead);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader title="Notifications" onBack={() => navigation.goBack()} safeArea />

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
              Registration, profile updates, and push alerts will appear here.
            </AppText>
          </AppCard>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.itemCard}>
            <AppView style={styles.itemHeader}>
              <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary, flex: 1 }}>
                {item.title}
              </AppText>
              {!item.read ? <AppView style={styles.unreadDot} /> : null}
            </AppView>
            <AppText preset="body" style={{ color: theme.textSecondary, marginTop: 6 }}>
              {item.body}
            </AppText>
            <AppText preset="caption" style={{ color: theme.textMuted, marginTop: 10 }}>
              {formatTime(item.createdAt)}
            </AppText>
          </AppCard>
        )}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  emptyCard: {
    padding: 20,
  },
  itemCard: {
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: brand.primary,
  },
});
