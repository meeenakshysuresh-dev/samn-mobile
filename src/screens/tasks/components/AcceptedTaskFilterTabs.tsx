import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '../../../components';
import { ACCEPTED_TASK_FILTER_TABS } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { AcceptedTaskFilterTab } from '../../../types/task.types';

type AcceptedTaskFilterTabsProps = {
  activeTab: AcceptedTaskFilterTab;
  onChange: (tab: AcceptedTaskFilterTab) => void;
};

export const AcceptedTaskFilterTabs = ({ activeTab, onChange }: AcceptedTaskFilterTabsProps) => {
  const { theme } = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ACCEPTED_TASK_FILTER_TABS.map(tab => {
        const selected = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
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
                fontFamily: fontFamily.medium,
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
    paddingVertical: spacing.xs,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
});
