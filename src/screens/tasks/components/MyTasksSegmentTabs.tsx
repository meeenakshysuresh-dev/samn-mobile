import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily } from '../../../theme/tokens';
import type { MyTasksSection } from '../../../types/task.types';
import {
  TASK_SEGMENT_HEIGHT,
  TASK_SEGMENT_RADIUS,
  TASK_SEGMENT_TAB_HEIGHT,
  TASK_SEGMENT_TAB_RADIUS,
  TASK_SEGMENT_TRACK_PADDING,
  taskInsetShadow,
  taskSoftShadow,
} from '../taskUiStyles';

type MyTasksSegmentTabsProps = {
  activeSection: MyTasksSection;
  onChange: (section: MyTasksSection) => void;
};

const SECTIONS: { key: MyTasksSection; label: string }[] = [
  { key: 'posted', label: 'Posted' },
  { key: 'accepted', label: 'Accepted' },
];

export const MyTasksSegmentTabs = ({ activeSection, onChange }: MyTasksSegmentTabsProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.wrap, taskInsetShadow(theme), { backgroundColor: theme.surfaceTertiary }]}>
      {SECTIONS.map(section => {
        const selected = activeSection === section.key;
        return (
          <Pressable
            key={section.key}
            style={[
              styles.tab,
              selected && [
                taskSoftShadow(theme, true),
                { backgroundColor: theme.card },
              ],
            ]}
            onPress={() => onChange(section.key)}
          >
            <AppText
              style={{
                color: selected ? brand.primary : theme.textSecondary,
                fontFamily: fontFamily.semibold,
                fontSize: 12,
                lineHeight: 16,
              }}
            >
              {section.label}
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
    borderRadius: TASK_SEGMENT_RADIUS,
    padding: TASK_SEGMENT_TRACK_PADDING,
    height: TASK_SEGMENT_HEIGHT,
  },
  tab: {
    flex: 1,
    height: TASK_SEGMENT_TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: TASK_SEGMENT_TAB_RADIUS,
  },
});
