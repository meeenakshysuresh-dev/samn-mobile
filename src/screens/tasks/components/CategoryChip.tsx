import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { TaskCategory } from '../../../types/task.types';
import { taskSoftShadow } from '../taskUiStyles';

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
        selected
          ? [{ backgroundColor: brand.primary, borderColor: brand.primary }, taskSoftShadow(theme)]
          : {
              backgroundColor: theme.card,
              borderColor: theme.borderBrand,
            },
      ]}
      onPress={onPress}
    >
      <AppText
        style={{
          color: selected ? brand.onPrimary : brand.primary,
          fontFamily: fontFamily.semibold,
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
    paddingVertical: spacing.sm + 2,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
});
