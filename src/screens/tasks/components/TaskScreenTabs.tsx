import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { TaskScreenTab } from '../../../types/task.types';

type TaskScreenTabsProps = {
  activeTab: TaskScreenTab;
  onChange: (tab: TaskScreenTab) => void;
};

const TABS: { key: TaskScreenTab; label: string }[] = [
  { key: 'myTasks', label: 'My Tasks' },
  { key: 'incoming', label: 'Incoming Tasks' },
];

export const TaskScreenTabs = ({ activeTab, onChange }: TaskScreenTabsProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
      {TABS.map(tab => {
        const selected = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              selected && { backgroundColor: theme.card, shadowColor: theme.shadow },
            ]}
            onPress={() => onChange(tab.key)}
          >
            <AppText
              style={{
                color: selected ? brand.primary : theme.textSecondary,
                fontFamily: fontFamily.semibold,
                fontSize: 13,
              }}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: 10,
  },
});
