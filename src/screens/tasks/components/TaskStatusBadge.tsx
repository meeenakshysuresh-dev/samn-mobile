import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components';
import { TASK_STATUS_LABELS } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { fontFamily, spacing } from '../../../theme/tokens';
import type { TaskStatus } from '../../../types/task.types';

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

const STATUS_BADGE_KEY: Record<TaskStatus, keyof ReturnType<typeof useAppTheme>['theme']['badgeColors']> = {
  open: 'info',
  accepted: 'primary',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'gray',
};

export const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  const { theme } = useAppTheme();
  const badge = theme.badgeColors[STATUS_BADGE_KEY[status]];

  return (
    <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
      <AppText style={[styles.label, { color: badge.text }]}>{TASK_STATUS_LABELS[status]}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    lineHeight: 14,
  },
});
