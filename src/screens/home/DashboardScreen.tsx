import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getCrashlytics, log } from '@react-native-firebase/crashlytics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText, AppView, CommonHeader, SectionHeading } from '../../components';
import { TASK_CATEGORIES } from '../../constants/tasks';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmExitOnBack } from '../../hooks/useConfirmExitOnBack';
import { useUnreadNotificationCount } from '../../hooks/useNotificationStore';
import { useBrowseableTasks, useTaskError, useTaskLoading } from '../../hooks/useTaskSelectors';
import { useRefreshTasks } from '../../hooks/useTaskSync';
import { useTaskUserContext } from '../../hooks/useTaskUserContext';
import { navigateToCreateStack } from '../../navigation/taskNavigation';
import { useTabBarInset, TAB_BAR_DEFAULT_INSET } from '../../navigation/tabBarLayout';
import type { HomeStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/tokens';
import type { TaskCategory } from '../../types/task.types';
import { getFirstName } from '../../utils/userName';
import { CategoryChip } from '../tasks/components/CategoryChip';
import { QuickActionCard } from '../tasks/components/QuickActionCard';
import { TaskCard } from '../tasks/components/TaskCard';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>;

export const DashboardScreen = () => {
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const navigation = useNavigation<Nav>();
  const { userProfile, user } = useAuth();
  const unreadNotificationCount = useUnreadNotificationCount();
  const { userId } = useTaskUserContext();
  const browseableTasks = useBrowseableTasks(userId);
  const loading = useTaskLoading();
  const error = useTaskError();
  const { refresh, refreshing } = useRefreshTasks();
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);

  const firstName = getFirstName(userProfile?.fullName ?? user?.displayName);
  const greetingName = firstName === 'there' ? 'Guest' : firstName;

  useConfirmExitOnBack();

  useEffect(() => {
    const app = getApp();
    log(getCrashlytics(), `Dashboard opened (${app.name})`);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userId !== 'guest-user') {
        void refresh(userId);
      }
    }, [refresh, userId]),
  );

  const goPostTask = () => navigateToCreateStack(navigation, 'PostTask');
  const goBrowseTasks = () => navigateToCreateStack(navigation, 'BrowseTasks');
  const goTaskDetails = (taskId: string) =>
    navigateToCreateStack(navigation, 'TaskDetails', { taskId });

  const nearbyTasks = selectedCategory
    ? browseableTasks.filter(task => task.category === selectedCategory)
    : browseableTasks;

  const handleRefresh = useCallback(() => {
    void refresh(userId);
  }, [refresh, userId]);

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title={`Hello, ${greetingName}`}
        subtitle="Find help or offer services nearby"
        greetingTitle
        showBackButton={false}
        safeArea={false}
        rightIcon="bell"
        rightBadgeCount={unreadNotificationCount}
        onRightPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET) + 24 },
        ]}
      >
        {error ? (
          <AppText preset="bodySmall" style={{ color: theme.error, marginBottom: spacing.md }}>
            {error}
          </AppText>
        ) : null}

        <View style={styles.quickActions}>
          <QuickActionCard label="Post a Task" icon="plus" onPress={goPostTask} />
          <QuickActionCard label="Browse Tasks" icon="search" onPress={goBrowseTasks} />
        </View>

        <SectionHeading title="CATEGORIES" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {TASK_CATEGORIES.map(category => (
            <CategoryChip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() =>
                setSelectedCategory(prev => (prev === category ? null : category))
              }
            />
          ))}
        </ScrollView>

        <SectionHeading title="NEARBY TASKS" />
        {loading && nearbyTasks.length === 0 ? (
          <ActivityIndicator color={theme.primary} style={{ marginBottom: spacing.lg }} />
        ) : nearbyTasks.length === 0 ? (
          <AppText preset="body" style={{ color: theme.textSecondary, marginBottom: spacing.lg }}>
            No open tasks nearby right now.
          </AppText>
        ) : (
          nearbyTasks.slice(0, 5).map(task => (
            <TaskCard
              key={task.id}
              task={task}
              variant="compact"
              onPress={() => goTaskDetails(task.id)}
            />
          ))
        )}

        {nearbyTasks.length > 5 ? (
          <Pressable onPress={goBrowseTasks} style={styles.viewAll}>
            <AppText preset="body" weight="semibold" style={{ color: theme.primary }}>
              View all tasks
            </AppText>
          </Pressable>
        ) : null}
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
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  categories: {
    paddingBottom: spacing.lg,
  },
  viewAll: {
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
});
