import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '../../../components';
import { POSTED_TASK_FILTER_TABS } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { PostedTaskFilterTab } from '../../../types/task.types';

type PostedStatusFilterProps = {
  value: PostedTaskFilterTab;
  onChange: (value: PostedTaskFilterTab) => void;
};

export const PostedStatusFilter = ({ value, onChange }: PostedStatusFilterProps) => {
  const { theme } = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {POSTED_TASK_FILTER_TABS.map(tab => {
        const selected = value === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? brand.primary : theme.surfaceSecondary,
                borderColor: selected ? brand.primary : theme.border,
              },
            ]}
            onPress={() => onChange(tab.key)}
          >
            <AppText
              style={{
                color: selected ? brand.onPrimary : theme.textSecondary,
                fontFamily: fontFamily.semibold,
                fontSize: 12,
              }}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
});
