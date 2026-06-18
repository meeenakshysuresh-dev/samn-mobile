import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppCard, AppIcon, AppText } from '../../../components';
import type { IconName } from '../../../components/AppIcon/IconRegistry';
import { formatBudget } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, spacing } from '../../../theme/tokens';
import type { Task } from '../../../types/task.types';
import { TaskStatusBadge } from './TaskStatusBadge';

export type TaskCardAction = {
  label: string;
  icon?: IconName;
  preset?: 'primary' | 'secondary' | 'inline';
  onPress?: () => void;
  textColor?: string;
};

type TaskCardProps = {
  task: Task;
  variant?: 'compact' | 'full';
  onPress?: () => void;
  onMenuPress?: () => void;
  primaryAction?: TaskCardAction;
  actions?: TaskCardAction[];
};

export const TaskCard = ({
  task,
  variant = 'compact',
  onPress,
  onMenuPress,
  primaryAction,
  actions = [],
}: TaskCardProps) => {
  const { theme } = useAppTheme();
  const showFooterAction = variant === 'full' && primaryAction;

  const content = (
    <>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <AppText preset="heading3" style={{ color: theme.textPrimary }} numberOfLines={1}>
            {task.title}
          </AppText>
          <AppText preset="caption" style={{ color: brand.primary, marginTop: 4 }}>
            {task.category}
          </AppText>
        </View>
        <View style={styles.titleActions}>
          <TaskStatusBadge status={task.status} />
          {onMenuPress ? (
            <Pressable
              onPress={onMenuPress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Task actions menu"
              style={[styles.menuButton, { borderColor: theme.border }]}
            >
              <AppIcon name="menu" width={16} height={16} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <AppIcon name="dollarSign" width={14} height={14} color={theme.textSecondary} />
          <AppText preset="caption" style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatBudget(task.budget)}
          </AppText>
        </View>
        <View style={[styles.metaItem, styles.metaItemWide]}>
          <AppIcon name="mapPin" width={14} height={14} color={theme.textSecondary} />
          <AppText preset="caption" style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>
            {task.location}
          </AppText>
        </View>
      </View>

      <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: spacing.sm }}>
        {task.distance ? `${task.distance} away · ` : ''}
        Posted {task.postedDate}
      </AppText>

      {showFooterAction ? (
        <View style={[styles.actionDivider, { backgroundColor: theme.border }]}>
          <AppButton
            text={primaryAction.label}
            preset={primaryAction.preset ?? 'secondary'}
            compact
            icon={primaryAction.icon}
            textColor={primaryAction.textColor}
            onPress={primaryAction.onPress}
          />
        </View>
      ) : null}

      {variant === 'full' && !primaryAction && actions.length > 0 ? (
        <View style={styles.actions}>
          {actions.map(action => (
            <AppButton
              key={action.label}
              text={action.label}
              preset={action.preset ?? 'inline'}
              compact
              icon={action.icon}
              textColor={action.textColor}
              style={styles.actionBtn}
              onPress={action.onPress}
            />
          ))}
        </View>
      ) : null}
    </>
  );

  if (variant === 'compact') {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {content}
        </AppCard>
      </Pressable>
    );
  }

  return (
    <AppCard style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {content}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderRadius: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  menuButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItemWide: {
    flex: 1,
  },
  metaText: {
    marginLeft: 6,
  },
  actionDivider: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flexGrow: 1,
    minWidth: '30%',
  },
});
