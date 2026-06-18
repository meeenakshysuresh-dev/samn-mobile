import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { MyTasksSection } from '../../../types/task.types';

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
    <View style={[styles.wrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
      {SECTIONS.map(section => {
        const selected = activeSection === section.key;
        return (
          <Pressable
            key={section.key}
            style={[
              styles.tab,
              selected && { backgroundColor: theme.card, shadowColor: theme.shadow },
            ]}
            onPress={() => onChange(section.key)}
          >
            <AppText
              style={{
                color: selected ? brand.primary : theme.textSecondary,
                fontFamily: fontFamily.semibold,
                fontSize: 12,
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
    borderWidth: 1,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 10,
  },
});
