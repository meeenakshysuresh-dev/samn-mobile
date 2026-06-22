import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabView, type SceneRendererProps } from 'react-native-tab-view';

import { AppText, AppView, CommonHeader, HeaderAppWordmark } from '../../components';
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
import type { MyTasksSection, PostedTaskFilterTab, Task, TaskCategory, TaskHubTab, TaskScreenTab } from '../../types/task.types';
import { taskMatchesSearchQuery } from '../../utils/taskSearch';
import { EmptyTaskState } from './components/EmptyTaskState';
import { MyTasksSegmentTabs } from './components/MyTasksSegmentTabs';
import { PostedStatusFilter } from './components/PostedStatusFilter';
import { TaskCard } from './components/TaskCard';
import { TaskCategoryFilterModal } from './components/TaskCategoryFilterModal';
import { TASK_SCREEN_ROUTES, TaskScreenTabBar, type TaskScreenRoute } from './components/TaskScreenTabs';
import { TaskSearchField } from './components/TaskSearchField';
import { TASK_SCREEN_HORIZONTAL_PADDING } from './taskUiStyles';

type Nav = NativeStackNavigationProp<CreateStackParamList, 'MyTasks'>;

type TasksTabContentProps = {
  screenTab: TaskScreenTab;
  query: string;
  setQuery: (value: string) => void;
  myTasksSection: MyTasksSection;
  setMyTasksSection: (value: MyTasksSection) => void;
  postedStatusFilter: PostedTaskFilterTab;
  setPostedStatusFilter: (value: PostedTaskFilterTab) => void;
  selectedCategory: TaskCategory | 'All';
  onFilterPress: () => void;
  onSwitchToIncoming: () => void;
  browseableTasks: Task[];
  postedTasks: Task[];
  acceptedTasks: Task[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  tabBarInset: number;
  buildPrimaryCardAction: ReturnType<typeof useTaskActions>['buildPrimaryCardAction'];
  showTaskMenu: ReturnType<typeof useTaskActions>['showTaskMenu'];
  viewDetails: ReturnType<typeof useTaskActions>['viewDetails'];
  navigation: Nav;
};

const TasksTabContent = ({
  screenTab,
  query,
  setQuery,
  myTasksSection,
  setMyTasksSection,
  postedStatusFilter,
  setPostedStatusFilter,
  selectedCategory,
  onFilterPress,
  onSwitchToIncoming,
  browseableTasks,
  postedTasks,
  acceptedTasks,
  loading,
  error,
  refreshing,
  onRefresh,
  tabBarInset,
  buildPrimaryCardAction,
  showTaskMenu,
  viewDetails,
  navigation,
}: TasksTabContentProps) => {
  const { theme } = useAppTheme();

  const cardActionTab: TaskHubTab = useMemo(() => {
    if (screenTab === 'incoming') {
      return 'available';
    }
    return myTasksSection === 'posted' ? 'posted' : 'accepted';
  }, [screenTab, myTasksSection]);

  const sourceTasks = useMemo(() => {
    if (screenTab === 'incoming') {
      return browseableTasks;
    }
    return myTasksSection === 'posted' ? postedTasks : acceptedTasks;
  }, [screenTab, myTasksSection, browseableTasks, postedTasks, acceptedTasks]);

  const visibleTasks = useMemo(() => {
    return sourceTasks.filter(task => {
      const matchesPostedStatus =
        screenTab !== 'myTasks' ||
        myTasksSection !== 'posted' ||
        postedStatusFilter === 'all' ||
        task.status === postedStatusFilter;
      const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
      return matchesPostedStatus && matchesCategory && taskMatchesSearchQuery(task, query);
    });
  }, [screenTab, myTasksSection, postedStatusFilter, query, selectedCategory, sourceTasks]);

  const emptyCopy = useMemo(() => {
    if (screenTab === 'incoming') {
      return {
        title: 'No Tasks Found',
        description: 'New tasks from your community will show up here.',
        buttonText: 'Post a Task',
        onPress: () => navigation.navigate('PostTask'),
      };
    }
    if (myTasksSection === 'posted') {
      return {
        title: 'No Tasks Found',
        description: 'Post a task when you need help from someone nearby.',
        buttonText: 'Post a Task',
        onPress: () => navigation.navigate('PostTask'),
      };
    }
    return {
      title: 'No Tasks Found',
      description: 'Accept an incoming task to get started.',
      buttonText: 'View Incoming Tasks',
      onPress: onSwitchToIncoming,
    };
  }, [myTasksSection, navigation, onSwitchToIncoming, screenTab]);

  const renderTaskItem = useCallback(
    ({ item, index }: { item: Task; index: number }) => {
      const primaryAction = buildPrimaryCardAction(item, cardActionTab);
      const opensDetails =
        primaryAction.label === 'View Details' || primaryAction.label === 'View';

      return (
        <View style={screenTab === 'incoming' && index === 0 ? styles.incomingTaskCard : undefined}>
          <TaskCard
            task={item}
            variant="refined"
            primaryAction={opensDetails ? undefined : primaryAction}
            onViewDetails={
              opensDetails ? primaryAction.onPress : () => viewDetails(item.id)
            }
            onMenuPress={
              screenTab === 'myTasks' && myTasksSection === 'posted'
                ? () => showTaskMenu(item)
                : undefined
            }
          />
        </View>
      );
    },
    [buildPrimaryCardAction, cardActionTab, myTasksSection, screenTab, showTaskMenu, viewDetails],
  );

  const listEmpty = loading ? (
    <ActivityIndicator color={theme.primary} style={{ marginVertical: spacing.xl }} />
  ) : (
    <EmptyTaskState
      title={emptyCopy.title}
      description={emptyCopy.description}
      buttonText={emptyCopy.buttonText}
      onCreatePress={emptyCopy.onPress}
    />
  );

  return (
    <View style={styles.tabPanel}>
      <View style={styles.controls}>
        {screenTab === 'myTasks' ? (
          <MyTasksSegmentTabs activeSection={myTasksSection} onChange={setMyTasksSection} />
        ) : null}

        <TaskSearchField
          value={query}
          onChangeText={setQuery}
          onFilterPress={onFilterPress}
          filterActive={selectedCategory !== 'All'}
          placeholder="Search by task name..."
        />

        {screenTab === 'myTasks' && myTasksSection === 'posted' ? (
          <PostedStatusFilter value={postedStatusFilter} onChange={setPostedStatusFilter} />
        ) : null}

        {error ? (
          <AppText preset="bodySmall" style={{ color: theme.error }}>
            {error}
          </AppText>
        ) : null}
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={item => item.id}
        renderItem={renderTaskItem}
        ListEmptyComponent={listEmpty}
        extraData={{ query, selectedCategory, postedStatusFilter, myTasksSection, screenTab }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET) + 24 },
          visibleTasks.length === 0 && styles.emptyContent,
        ]}
        ListFooterComponent={
          visibleTasks.length > 0 ? (
            <AppText preset="caption" style={{ color: theme.textSecondary, textAlign: 'center', marginTop: spacing.sm }}>
              {visibleTasks.length} task{visibleTasks.length === 1 ? '' : 's'}
            </AppText>
          ) : null
        }
      />
    </View>
  );
};

export const MyTasksScreen = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useAppTheme();
  const layout = useWindowDimensions();
  const tabBarInset = useTabBarInset();
  const { userId, userName } = useTaskUserContext();
  const unreadNotificationCount = useUnreadNotificationCount();
  const { buildPrimaryCardAction, showTaskMenu, viewDetails } = useTaskActions(userId, userName);

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
  const [categoryFilterVisible, setCategoryFilterVisible] = useState(false);

  const tabIndex = activeScreenTab === 'myTasks' ? 0 : 1;

  const handleTabIndexChange = useCallback((index: number) => {
    setActiveScreenTab(TASK_SCREEN_ROUTES[index]?.key ?? 'myTasks');
  }, []);

  const handleSwitchToIncoming = useCallback(() => {
    setActiveScreenTab('incoming');
  }, []);

  const sharedTabProps = useMemo(
    () => ({
      query,
      setQuery,
      myTasksSection,
      setMyTasksSection,
      postedStatusFilter,
      setPostedStatusFilter,
      selectedCategory,
      onFilterPress: () => setCategoryFilterVisible(true),
      onSwitchToIncoming: handleSwitchToIncoming,
      browseableTasks,
      postedTasks,
      acceptedTasks,
      loading,
      error,
      refreshing,
      onRefresh: handleRefresh,
      tabBarInset,
      buildPrimaryCardAction,
      showTaskMenu,
      viewDetails,
      navigation,
    }),
    [
      acceptedTasks,
      browseableTasks,
      buildPrimaryCardAction,
      error,
      handleRefresh,
      handleSwitchToIncoming,
      loading,
      myTasksSection,
      navigation,
      postedStatusFilter,
      postedTasks,
      query,
      refreshing,
      selectedCategory,
      showTaskMenu,
      tabBarInset,
      viewDetails,
    ],
  );

  const renderScene = useCallback(
    ({ route }: SceneRendererProps & { route: TaskScreenRoute }) => (
      <TasksTabContent screenTab={route.key} {...sharedTabProps} />
    ),
    [sharedTabProps],
  );

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title="Tasks"
        showBackButton={false}
        safeArea={false}
        leftContent={<HeaderAppWordmark />}
        rightIcon="bell"
        rightBadgeCount={unreadNotificationCount}
        onRightPress={() => navigateToHomeStack(navigation, 'Notifications')}
      />

      <TabView
        navigationState={{ index: tabIndex, routes: TASK_SCREEN_ROUTES }}
        renderScene={renderScene}
        onIndexChange={handleTabIndexChange}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => <TaskScreenTabBar {...props} />}
        style={styles.tabView}
        lazy
      />

      <TaskCategoryFilterModal
        visible={categoryFilterVisible}
        value={selectedCategory}
        onClose={() => setCategoryFilterVisible(false)}
        onApply={setSelectedCategory}
      />
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabPanel: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: TASK_SCREEN_HORIZONTAL_PADDING,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: TASK_SCREEN_HORIZONTAL_PADDING,
    paddingTop: spacing.xs,
  },
  emptyContent: {
    flexGrow: 1,
  },
  incomingTaskCard: {
    marginTop: 15,
  },
});
