import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { TaskCategory } from '../../../types/task.types';

type CategoryChipProps = {
  label: TaskCategory | string;
  selected?: boolean;
  onPress?: () => void;
};

export const CategoryChip = ({ label, selected = false, onPress }: CategoryChipProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[
        styles.chip,
        {
          backgroundColor: selected ? brand.primary : theme.card,
          borderColor: selected ? brand.primary : theme.border,
        },
      ]}
      onPress={onPress}
    >
      <AppText
        style={{
          color: selected ? brand.onPrimary : theme.textPrimary,
          fontFamily: fontFamily.medium,
          fontSize: 12,
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
});
