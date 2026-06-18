import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { TASK_STATUS_LABELS } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, spacing } from '../../../theme/tokens';
import type { TaskTimelineEvent } from '../../../types/task.types';

type TaskTimelineProps = {
  events: TaskTimelineEvent[];
};

export const TaskTimeline = ({ events }: TaskTimelineProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <View key={event.id} style={styles.row}>
            <View style={styles.markerCol}>
              <View style={[styles.dot, { backgroundColor: brand.primary, borderColor: theme.card }]} />
              {!isLast ? <View style={[styles.line, { backgroundColor: theme.border }]} /> : null}
            </View>
            <View style={[styles.content, !isLast && styles.contentSpacing]}>
              <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary }}>
                {TASK_STATUS_LABELS[event.status]}
              </AppText>
              <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 2 }}>
                {event.label}
                {event.actorName ? ` · ${event.actorName}` : ''}
              </AppText>
              <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 2 }}>
                {event.timestamp}
              </AppText>
            </View>
          </View>
        );
      })}
      {events.length === 0 ? (
        <View style={styles.empty}>
          <AppIcon name="clock" width={18} height={18} color={theme.textSecondary} />
          <AppText preset="caption" style={{ color: theme.textSecondary, marginLeft: spacing.sm }}>
            No timeline events yet.
          </AppText>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  markerCol: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    minHeight: 28,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  contentSpacing: {
    paddingBottom: spacing.lg,
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
