import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppInput, AppText, AppView, CommonHeader } from '../../components';
import { TASK_CATEGORIES } from '../../constants/tasks';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useBrowseableTasks, useTaskError, useTaskLoading } from '../../hooks/useTaskSelectors';
import { useRefreshTasks } from '../../hooks/useTaskSync';
import { useTaskUserContext } from '../../hooks/useTaskUserContext';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import type { CreateStackParamList } from '../../navigation/RootNavigator.types';
import { exitCreateStackScreen } from '../../navigation/taskNavigation';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/tokens';
import type { TaskCategory } from '../../types/task.types';
import { taskMatchesSearchQuery } from '../../utils/taskSearch';
import { CategoryChip } from './components/CategoryChip';
import { TaskCard } from './components/TaskCard';

type Nav = NativeStackNavigationProp<CreateStackParamList, 'BrowseTasks'>;

export const BrowseTasksScreen = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const { userId, userName } = useTaskUserContext();
  const { buildPrimaryCardAction } = useTaskActions(userId, userName);
  const browseableTasks = useBrowseableTasks(userId);
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

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');

  const filteredTasks = useMemo(() => {
    return browseableTasks.filter(task => {
      const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
      return matchesCategory && taskMatchesSearchQuery(task, query);
    });
  }, [browseableTasks, query, selectedCategory]);

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title="Browse Tasks"
        showBackButton
        onBack={() => exitCreateStackScreen(navigation)}
        safeArea={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 24 }]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
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

        {error ? (
          <AppText preset="bodySmall" style={{ color: theme.error }}>
            {error}
          </AppText>
        ) : null}

        {loading && filteredTasks.length === 0 ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: spacing.md }} />
        ) : filteredTasks.length === 0 ? (
          <AppText preset="body" style={{ color: theme.textSecondary, marginTop: spacing.md }}>
            No open tasks match your filters.
          </AppText>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              variant="full"
              primaryAction={buildPrimaryCardAction(task, 'available')}
            />
          ))
        )}
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: spacing.md,
  },
  categories: {
    paddingBottom: spacing.sm,
  },
});
