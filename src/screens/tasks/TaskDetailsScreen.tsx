import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import { AppButton, AppCard, AppIcon, AppText, AppView, CommonHeader } from '../../components';
import type { IconName } from '../../components/AppIcon/IconRegistry';
import { TASK_ACTION_LABELS, formatBudget } from '../../constants/tasks';
import { useTaskActions } from '../../hooks/useTaskActions';
import { useTaskById } from '../../hooks/useTaskSelectors';
import { useTaskUserContext } from '../../hooks/useTaskUserContext';
import { useTabBarInset } from '../../navigation/tabBarLayout';
import type { CreateStackParamList } from '../../navigation/RootNavigator.types';
import { exitCreateStackScreen } from '../../navigation/taskNavigation';
import { navigateToChatThread } from '../../navigation/stackNavigation';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/tokens';
import type { TaskActionKey } from '../../types/task.types';
import { canAccessTaskChat, getTaskActions, getTaskViewerRole } from '../../utils/taskWorkflow';
import { TaskStatusBadge } from './components/TaskStatusBadge';
import { TaskTimeline } from './components/TaskTimeline';

type Nav = NativeStackNavigationProp<CreateStackParamList, 'TaskDetails'>;
type Route = RouteProp<CreateStackParamList, 'TaskDetails'>;

const ACTION_BUTTON_PRESET: Partial<Record<TaskActionKey, 'primary' | 'secondary' | 'inline'>> = {
  accept: 'primary',
  complete: 'primary',
  edit: 'secondary',
  start: 'secondary',
  delete: 'inline',
  cancelTask: 'inline',
  cancelAcceptance: 'inline',
};

export const TaskDetailsScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { theme } = useAppTheme();
  const tabBarInset = useTabBarInset();
  const { userId, userName } = useTaskUserContext();
  const { runAction } = useTaskActions(userId, userName);

  const task = useTaskById(route.params.taskId);

  const role = useMemo(
    () => (task ? getTaskViewerRole(task, userId) : 'viewer'),
    [task, userId],
  );

  const actions = useMemo(
    () => (task ? getTaskActions(task, userId) : []),
    [task, userId],
  );

  if (!task) {
    return (
      <AppView style={[styles.container, { backgroundColor: theme.background }]}>
        <CommonHeader
          title="Task Details"
          showBackButton
          onBack={() => exitCreateStackScreen(navigation)}
          safeArea={false}
        />
        <View style={styles.center}>
          <AppText preset="body" style={{ color: theme.textSecondary }}>
            Task not found.
          </AppText>
        </View>
      </AppView>
    );
  }

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title="Task Details"
        showBackButton
        onBack={() => exitCreateStackScreen(navigation)}
        safeArea={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarInset + 24 }]}
      >
        <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.headerRow}>
            <AppText preset="heading1" style={{ color: theme.textPrimary, flex: 1 }}>
              {task.title}
            </AppText>
            <TaskStatusBadge status={task.status} />
          </View>
          <AppText preset="body" style={{ color: theme.textSecondary, marginTop: spacing.sm }}>
            {task.category}
          </AppText>
        </AppCard>

        <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={{ color: theme.textSecondary }}>
            Description
          </AppText>
          <AppText preset="body" style={{ color: theme.textPrimary, marginTop: spacing.sm, lineHeight: 20 }}>
            {task.description}
          </AppText>
        </AppCard>

        <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <DetailRow icon="mapPin" label="Location" value={task.location} />
          <DetailRow icon="dollarSign" label="Budget" value={formatBudget(task.budget)} />
          <DetailRow icon="calendar" label="Preferred Time" value={task.preferredDateTime} />
          <DetailRow icon="clock" label="Posted" value={task.postedDate} />
          <DetailRow
            icon="tag"
            label="Priority"
            value={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          />
        </AppCard>

        <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={{ color: theme.textSecondary, marginBottom: spacing.sm }}>
            Owner
          </AppText>
          <PersonRow name={task.ownerName} subtitle="Task owner" />
          {task.workerName ? (
            <>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <AppText preset="overline" style={{ color: theme.textSecondary, marginBottom: spacing.sm }}>
                Worker
              </AppText>
              <PersonRow name={task.workerName} subtitle="Assigned worker" />
            </>
          ) : (
            <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: spacing.sm }}>
              No worker assigned yet.
            </AppText>
          )}
        </AppCard>

        <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <AppText preset="overline" style={{ color: theme.textSecondary, marginBottom: spacing.sm }}>
            Status Timeline
          </AppText>
          <TaskTimeline events={task.timeline} />
        </AppCard>

        {canAccessTaskChat(task, userId) ? (
          <View style={styles.actions}>
            <AppButton
              text="Open Chat"
              preset="primary"
              onPress={() => navigateToChatThread(navigation, task.id)}
            />
          </View>
        ) : null}

        {role !== 'viewer' || actions.length > 0 ? (
          <View style={styles.actions}>
            {actions.map(action => (
              <AppButton
                key={action}
                text={TASK_ACTION_LABELS[action]}
                preset={ACTION_BUTTON_PRESET[action] ?? 'inline'}
                onPress={() => runAction(task, action)}
                textColor={
                  action === 'delete' || action === 'cancelTask' || action === 'cancelAcceptance'
                    ? theme.error
                    : undefined
                }
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </AppView>
  );
};

const PersonRow = ({ name, subtitle }: { name: string; subtitle: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.personRow}>
      <View style={[styles.avatar, { backgroundColor: theme.surfaceSecondary }]}>
        <AppText preset="body" weight="bold" style={{ color: theme.primary }}>
          {name.charAt(0).toUpperCase()}
        </AppText>
      </View>
      <View>
        <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary }}>
          {name}
        </AppText>
        <AppText preset="caption" style={{ color: theme.textSecondary }}>
          {subtitle}
        </AppText>
      </View>
    </View>
  );
};

const DetailRow = ({ icon, label, value }: { icon: IconName; label: string; value: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.detailRow}>
      <AppIcon name={icon} width={16} height={16} color={theme.textSecondary} />
      <View style={styles.detailText}>
        <AppText preset="caption" style={{ color: theme.textSecondary }}>
          {label}
        </AppText>
        <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary, marginTop: 2 }}>
          {value}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  detailText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
});
