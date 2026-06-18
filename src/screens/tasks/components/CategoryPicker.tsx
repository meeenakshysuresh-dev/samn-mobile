import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { TASK_CATEGORIES } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { fontFamily, spacing } from '../../../theme/tokens';
import type { TaskCategory } from '../../../types/task.types';
import { taskFormLayout, taskFormStyles } from '../taskFormStyles';

type CategoryPickerProps = {
  label?: string;
  value?: TaskCategory | '';
  onChange: (category: TaskCategory) => void;
  error?: string;
};

export const CategoryPicker = ({ label = 'Category', value, onChange, error }: CategoryPickerProps) => {
  const { theme } = useAppTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={taskFormStyles.field}>
      <AppText preset="label" style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </AppText>

      <Pressable
        style={[
          styles.field,
          taskFormStyles.inputWrapper,
          {
            backgroundColor: theme.card,
            borderColor: error ? theme.error : theme.border,
          },
        ]}
        onPress={() => setOpen(prev => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <AppText
          preset="bodyLarge"
          style={{
            color: value ? theme.textPrimary : theme.textSecondary,
            flex: 1,
            fontFamily: fontFamily.regular,
          }}
        >
          {value || 'Select a category'}
        </AppText>
        <AppIcon name={open ? 'chevronUp' : 'chevronDown'} width={18} height={18} color={theme.textSecondary} />
      </Pressable>

      {error ? (
        <AppText preset="bodySmall" style={{ color: theme.error, marginTop: spacing.xs }}>
          {error}
        </AppText>
      ) : null}

      {open ? (
        <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {TASK_CATEGORIES.map(category => {
            const selected = value === category;
            return (
              <Pressable
                key={category}
                style={[
                  styles.option,
                  {
                    backgroundColor: selected ? theme.surfaceSecondary : 'transparent',
                    borderBottomColor: theme.border,
                  },
                ]}
                onPress={() => {
                  onChange(category);
                  setOpen(false);
                }}
              >
                <AppText preset="bodyLarge" style={{ color: theme.textPrimary, fontFamily: fontFamily.regular }}>
                  {category}
                </AppText>
                {selected ? <AppIcon name="check" width={16} height={16} color={theme.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 4,
    marginLeft: 4,
  },
  field: {
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: taskFormLayout.inputHeight,
  },
  dropdown: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderRadius: taskFormLayout.inputRadius,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
