import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppIcon, AppText } from '../../../components';
import type { IconName } from '../../../components/AppIcon/IconRegistry';
import { formatBudget, getTaskCategoryEmoji } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { Task } from '../../../types/task.types';
import { taskSoftShadow } from '../taskUiStyles';
import { ProfileAvatar } from './ProfileAvatar';
import { TaskCardActionButton } from './TaskCardActionButton';
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
  variant?: 'compact' | 'full' | 'grid' | 'refined';
  onPress?: () => void;
  onMenuPress?: () => void;
  onViewDetails?: () => void;
  primaryAction?: TaskCardAction;
  actions?: TaskCardAction[];
};

export const TaskCard = ({
  task,
  variant = 'compact',
  onPress,
  onMenuPress,
  onViewDetails,
  primaryAction,
  actions = [],
}: TaskCardProps) => {
  const { theme } = useAppTheme();
  const showLegacyFooter = variant === 'full' && primaryAction;
  const showRefinedFooter = variant === 'refined' && (onViewDetails || primaryAction);
  const showGridFooter = variant === 'grid' && primaryAction;

  if (variant === 'refined') {
    const showSecondButton = primaryAction && primaryAction.label !== 'View Details';

    return (
      <View
        style={[
          styles.refinedCard,
          taskSoftShadow(theme, true),
          {
            backgroundColor: theme.card,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <View style={styles.refinedTopRow}>
          <View style={[styles.categoryIconWrap, { backgroundColor: theme.surfaceSecondary }]}>
            <AppText style={styles.categoryEmoji}>{getTaskCategoryEmoji(task.category)}</AppText>
          </View>

          <View style={styles.refinedTitleBlock}>
            <AppText preset="heading3" weight="bold" numberOfLines={2} style={{ color: theme.textPrimary }}>
              {task.title}
            </AppText>
            <AppText preset="caption" style={{ color: brand.primary, marginTop: 2, fontFamily: fontFamily.medium }}>
              {task.category}
            </AppText>
          </View>

          <View style={styles.refinedTopActions}>
            <TaskStatusBadge status={task.status} />
            {onMenuPress ? (
              <Pressable
                onPress={onMenuPress}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Task actions menu"
                style={[styles.menuButton, { borderColor: theme.borderSubtle, backgroundColor: theme.surfaceSecondary }]}
              >
                <AppIcon name="menu" width={16} height={16} color={theme.textSecondary} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.refinedMetaGrid}>
          <View style={styles.metaItem}>
            <AppIcon name="currencyInr" width={14} height={14} color={brand.primary} />
            <AppText preset="caption" style={[styles.metaText, { color: theme.textPrimary, fontFamily: fontFamily.semibold }]}>
              {formatBudget(task.budget)}
            </AppText>
          </View>
        </View>

        <View style={styles.locationOwnerRow}>
          <View style={[styles.metaItem, styles.locationBlock]}>
            <AppIcon name="mapPin" width={14} height={14} color={theme.textSecondary} />
            <AppText preset="caption" numberOfLines={1} style={[styles.metaText, { color: theme.textSecondary, flex: 1 }]}>
              {task.location}
            </AppText>
          </View>
          <View style={styles.ownerInline}>
            <ProfileAvatar name={task.ownerName} size={22} />
            <AppText preset="caption" numberOfLines={1} style={{ color: theme.textSecondary, flexShrink: 1, maxWidth: 96 }}>
              {task.ownerName}
            </AppText>
          </View>
        </View>

        <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 4 }}>
          {task.distance ? `${task.distance} away · ` : ''}
          Posted {task.postedDate}
        </AppText>

        {showRefinedFooter ? (
          <View style={styles.refinedActions}>
            {onViewDetails ? (
              <TaskCardActionButton label="View Details" onPress={onViewDetails} variant="filled" />
            ) : null}
            {showSecondButton ? (
              <TaskCardActionButton
                label={primaryAction.label}
                icon={primaryAction.icon}
                onPress={primaryAction.onPress}
                variant="filled"
              />
            ) : null}
            {!showSecondButton && primaryAction && !onViewDetails ? (
              <TaskCardActionButton
                label={primaryAction.label}
                icon={primaryAction.icon}
                onPress={primaryAction.onPress}
                variant="filled"
                style={styles.singleAction}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }

  if (variant === 'grid') {
    return (
      <View style={styles.gridItem}>
        <View
          style={[
            styles.gridCard,
            taskSoftShadow(theme, true),
            {
              backgroundColor: theme.card,
              borderColor: theme.borderSubtle,
            },
          ]}
        >
          <View style={styles.gridHeader}>
            <AppText style={styles.gridEmoji}>{getTaskCategoryEmoji(task.category)}</AppText>
            {onMenuPress ? (
              <Pressable
                onPress={onMenuPress}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Task actions menu"
                style={[styles.menuButton, { borderColor: theme.borderSubtle, backgroundColor: theme.surfaceSecondary }]}
              >
                <AppIcon name="menu" width={14} height={14} color={theme.textSecondary} />
              </Pressable>
            ) : null}
          </View>

          <AppText preset="heading3" weight="bold" numberOfLines={2} style={{ color: theme.textPrimary, marginTop: spacing.xs }}>
            {task.title}
          </AppText>
          <AppText preset="caption" style={{ color: brand.primary, marginTop: 4, fontFamily: fontFamily.medium }}>
            {task.category}
          </AppText>

          <View style={styles.gridMetaRow}>
            <AppIcon name="currencyInr" width={13} height={13} color={theme.textSecondary} />
            <AppText preset="caption" style={[styles.metaText, { color: theme.textSecondary, fontFamily: fontFamily.semibold }]}>
              {formatBudget(task.budget)}
            </AppText>
          </View>

          <View style={styles.gridMetaRow}>
            <AppIcon name="mapPin" width={13} height={13} color={theme.textSecondary} />
            <AppText preset="caption" numberOfLines={2} style={[styles.metaText, { color: theme.textSecondary, flex: 1 }]}>
              {task.location}
            </AppText>
          </View>

          <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: spacing.xs }}>
            {task.distance ? `${task.distance} · ` : ''}
            Posted {task.postedDate}
          </AppText>

          <View style={styles.gridBadgeRow}>
            <TaskStatusBadge status={task.status} />
          </View>

          {showGridFooter ? (
            <AppButton
              text={primaryAction.label}
              preset={primaryAction.preset === 'secondary' ? 'primary' : (primaryAction.preset ?? 'primary')}
              compact
              icon={primaryAction.icon}
              textColor={primaryAction.textColor}
              style={styles.gridActionButton}
              onPress={primaryAction.onPress}
            />
          ) : null}
        </View>
      </View>
    );
  }

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
          <AppIcon name="currencyInr" width={14} height={14} color={theme.textSecondary} />
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

      {showLegacyFooter ? (
        <View style={[styles.actionDivider, { backgroundColor: theme.border }]}>
          <AppButton
            text={primaryAction.label}
            preset={primaryAction.preset === 'secondary' ? 'primary' : (primaryAction.preset ?? 'primary')}
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
        <View style={[styles.card, taskSoftShadow(theme), { backgroundColor: theme.card, borderColor: theme.borderSubtle }]}>
          {content}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, taskSoftShadow(theme), { backgroundColor: theme.card, borderColor: theme.borderSubtle }]}>
      {content}
    </View>
  );
};

const GRID_GAP = 12;

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderRadius: 22,
  },
  refinedCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  refinedTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  refinedTitleBlock: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  refinedTopActions: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  refinedMetaGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  locationOwnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: spacing.sm,
  },
  locationBlock: {
    flex: 1,
    minWidth: 0,
  },
  ownerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
    maxWidth: '42%',
  },
  refinedActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  singleAction: {
    flex: 1,
  },
  gridItem: {
    flex: 1,
    marginBottom: GRID_GAP,
  },
  gridCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.md,
    minHeight: 248,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  gridEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  gridMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    gap: 4,
  },
  gridBadgeRow: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  gridActionButton: {
    marginTop: spacing.md,
    borderRadius: 999,
    minHeight: 40,
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
