import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { TabBar, type TabBarProps } from 'react-native-tab-view';

import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily } from '../../../theme/tokens';
import type { TaskScreenTab } from '../../../types/task.types';

export type TaskScreenRoute = {
  key: TaskScreenTab;
  title: string;
};

export const TASK_SCREEN_ROUTES: TaskScreenRoute[] = [
  { key: 'myTasks', title: 'My Tasks' },
  { key: 'incoming', title: 'Incoming Tasks' },
];

export const TaskScreenTabBar = (props: TabBarProps<TaskScreenRoute>) => {
  const { theme } = useAppTheme();

  const options = useMemo(
    () =>
      Object.fromEntries(
        TASK_SCREEN_ROUTES.map(route => [
          route.key,
          {
            labelStyle: {
              fontFamily: fontFamily.semibold,
              fontSize: 13,
              lineHeight: 18,
              textTransform: 'none' as const,
            },
          },
        ]),
      ),
    [],
  );

  return (
    <TabBar
      {...props}
      options={options}
      style={[styles.bar, { backgroundColor: theme.background, borderBottomColor: theme.borderSubtle }]}
      indicatorStyle={[styles.indicator, { backgroundColor: brand.primary }]}
      activeColor={brand.primary}
      inactiveColor={theme.textSecondary}
      pressColor={`${brand.primary}18`}
      tabStyle={styles.tab}
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  indicator: {
    height: 3,
    borderRadius: 1.5,
  },
  tab: {
    minHeight: 44,
    paddingHorizontal: 4,
  },
});
