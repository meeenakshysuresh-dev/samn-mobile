import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppInput, AppText, AppView, CommonHeader } from '../../components';
import { TASK_CATEGORIES } from '../../constants/tasks';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useConfirmExitOnBack } from '../../hooks/useConfirmExitOnBack';
import { useUnreadNotificationCount } from '../../hooks/useNotificationStore';
import { useAcceptedTasks, useBrowseableTasks, usePostedTasks, useTaskError, useTaskLoading } from '../../hooks/useTaskSelectors';
import { useRefreshTasks } from '../../hooks/useTaskSync';
import { useTaskUserContext } from '../../hooks/useTaskUserContext';
import { navigateToHomeStack } from '../../navigation/stackNavigation';
import { useTabBarInset, TAB_BAR_DEFAULT_INSET } from '../../navigation/tabBarLayout';
import type { CreateStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/tokens';
import type { MyTasksSection, PostedTaskFilterTab, TaskCategory, TaskHubTab, TaskScreenTab } from '../../types/task.types';
import { CategoryChip } from './components/CategoryChip';
import { EmptyTaskState } from './components/EmptyTaskState';
import { MyTasksSegmentTabs } from './components/MyTasksSegmentTabs';
import { PostedStatusFilter } from './components/PostedStatusFilter';
import { TaskCard } from './components/TaskCard';
import { TaskScreenTabs } from './components/TaskScreenTabs';

type Nav = NativeStackNavigationProp<CreateStackParamList, 'MyTasks'>;

export const MyTasksScreen = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const { userId, userName } = useTaskUserContext();
  const unreadNotificationCount = useUnreadNotificationCount();
  const { buildPrimaryCardAction, showTaskMenu } = useTaskActions(userId, userName);

  useConfirmExitOnBack();

  const browseableTasks = useBrowseableTasks(userId);
  const postedTasks = usePostedTasks(userId);
  const acceptedTasks = useAcceptedTasks(userId);
  const loading = useTaskLoading();
  const error = useTaskError();
  const { refresh, refreshing } = useRefreshTasks();

  useFocusEffect(
    useCallback(() => {
      if (userId !== 'guest-user') {
        void refresh(userId);
      }
    }, [refresh, userId]),
  );

  const handleRefresh = useCallback(() => {
    void refresh(userId);
  }, [refresh, userId]);

  const [activeScreenTab, setActiveScreenTab] = useState<TaskScreenTab>('myTasks');
  const [myTasksSection, setMyTasksSection] = useState<MyTasksSection>('posted');
  const [postedStatusFilter, setPostedStatusFilter] = useState<PostedTaskFilterTab>('all');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');

  const cardActionTab: TaskHubTab = useMemo(() => {
    if (activeScreenTab === 'incoming') {
      return 'available';
    }
    return myTasksSection === 'posted' ? 'posted' : 'accepted';
  }, [activeScreenTab, myTasksSection]);

  const sourceTasks = useMemo(() => {
    if (activeScreenTab === 'incoming') {
      return browseableTasks;
    }
    return myTasksSection === 'posted' ? postedTasks : acceptedTasks;
  }, [activeScreenTab, myTasksSection, browseableTasks, postedTasks, acceptedTasks]);

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sourceTasks.filter(task => {
      const matchesPostedStatus =
        activeScreenTab !== 'myTasks' ||
        myTasksSection !== 'posted' ||
        postedStatusFilter === 'all' ||
        task.status === postedStatusFilter;
      const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
      const matchesQuery =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.category.toLowerCase().includes(normalizedQuery) ||
        task.location.toLowerCase().includes(normalizedQuery);
      return matchesPostedStatus && matchesCategory && matchesQuery;
    });
  }, [activeScreenTab, myTasksSection, postedStatusFilter, query, selectedCategory, sourceTasks]);

  const emptyCopy = useMemo(() => {
    if (activeScreenTab === 'incoming') {
      return {
        title: 'No incoming tasks',
        description: 'New tasks from your community will show up here.',
        buttonText: 'Post a Task',
        onPress: () => navigation.navigate('PostTask'),
      };
    }
    if (myTasksSection === 'posted') {
      return {
        title: 'No posted tasks yet',
        description: 'Post a task when you need help from someone nearby.',
        buttonText: 'Post a Task',
        onPress: () => navigation.navigate('PostTask'),
      };
    }
    return {
      title: 'No accepted tasks',
      description: 'Accept an incoming task to get started.',
      buttonText: 'View Incoming Tasks',
      onPress: () => setActiveScreenTab('incoming'),
    };
  }, [activeScreenTab, myTasksSection, navigation]);

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title="Tasks"
        showBackButton={false}
        safeArea={false}
        rightIcon="bell"
        rightBadgeCount={unreadNotificationCount}
        onRightPress={() => navigateToHomeStack(navigation, 'Notifications')}
      />

      <View style={styles.topTabs}>
        <TaskScreenTabs activeTab={activeScreenTab} onChange={setActiveScreenTab} />
      </View>

      <View style={styles.controls}>
        {activeScreenTab === 'myTasks' ? (
          <MyTasksSegmentTabs activeSection={myTasksSection} onChange={setMyTasksSection} />
        ) : null}

        <AppInput
          label="Search"
          placeholder="Search tasks..."
          value={query}
          onChangeText={setQuery}
          leftIcon="search"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          <CategoryChip
            label="All"
            selected={selectedCategory === 'All'}
            onPress={() => setSelectedCategory('All')}
          />
          {TASK_CATEGORIES.map(category => (
            <CategoryChip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>

        {activeScreenTab === 'myTasks' && myTasksSection === 'posted' ? (
          <PostedStatusFilter value={postedStatusFilter} onChange={setPostedStatusFilter} />
        ) : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET) + 24 },
        ]}
      >
        {error ? (
          <AppText preset="bodySmall" style={{ color: theme.error, marginBottom: spacing.sm }}>
            {error}
          </AppText>
        ) : null}

        {loading && visibleTasks.length === 0 ? (
          <ActivityIndicator color={theme.primary} style={{ marginVertical: spacing.lg }} />
        ) : visibleTasks.length === 0 ? (
          <EmptyTaskState
            title={emptyCopy.title}
            description={emptyCopy.description}
            buttonText={emptyCopy.buttonText}
            onCreatePress={emptyCopy.onPress}
          />
        ) : (
          visibleTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              variant="full"
              primaryAction={buildPrimaryCardAction(task, cardActionTab)}
              onMenuPress={
                activeScreenTab === 'myTasks' && myTasksSection === 'posted'
                  ? () => showTaskMenu(task)
                  : undefined
              }
            />
          ))
        )}

        {visibleTasks.length > 0 ? (
          <AppText preset="caption" style={{ color: theme.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
            {visibleTasks.length} task{visibleTasks.length === 1 ? '' : 's'}
          </AppText>
        ) : null}
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topTabs: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  controls: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: spacing.md,
  },
  categories: {
    paddingBottom: spacing.xs,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
});
