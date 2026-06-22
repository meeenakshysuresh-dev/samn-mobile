import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '../../../components';
import { TASK_CATEGORIES } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { TaskCategory } from '../../../types/task.types';
import {
  TASK_CHIP_GAP,
  TASK_CHIP_PADDING_H,
  TASK_CHIP_PADDING_V,
  taskSoftShadow,
} from '../taskUiStyles';

export type TaskCategoryFilterValue = TaskCategory | 'All';

type TaskCategoryFilterModalProps = {
  visible: boolean;
  value: TaskCategoryFilterValue;
  onClose: () => void;
  onApply: (value: TaskCategoryFilterValue) => void;
};

const FILTER_OPTIONS: TaskCategoryFilterValue[] = ['All', ...TASK_CATEGORIES];

export const TaskCategoryFilterModal = ({
  visible,
  value,
  onClose,
  onApply,
}: TaskCategoryFilterModalProps) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<TaskCategoryFilterValue>(value);

  useEffect(() => {
    if (visible) {
      setDraft(value);
    }
  }, [value, visible]);

  const handleReset = () => {
    onApply('All');
    onClose();
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />

        <View
          style={[
            styles.sheet,
            taskSoftShadow(theme, true),
            {
              backgroundColor: theme.card,
              paddingBottom: Math.max(insets.bottom, spacing.md),
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.borderSubtle }]} />

          <AppText preset="heading2" weight="bold" style={{ color: theme.textPrimary }}>
            Filter by Category
          </AppText>
          <AppText preset="bodySmall" style={{ color: theme.textSecondary, marginTop: spacing.xs }}>
            {draft === 'All' ? 'Showing tasks from all categories' : `Showing ${draft} tasks only`}
          </AppText>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.optionsWrap}
            keyboardShouldPersistTaps="handled"
          >
            {FILTER_OPTIONS.map(option => {
              const selected = draft === option;
              return (
                <Pressable
                  key={option}
                  style={[
                    styles.option,
                    selected
                      ? [{ backgroundColor: brand.primary, borderColor: brand.primary }, taskSoftShadow(theme)]
                      : {
                          backgroundColor: theme.surfaceSecondary,
                          borderColor: theme.borderBrand,
                        },
                  ]}
                  onPress={() => setDraft(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <AppText
                    style={{
                      color: selected ? brand.onPrimary : brand.primary,
                      fontFamily: fontFamily.semibold,
                      fontSize: 11,
                      lineHeight: 14,
                    }}
                  >
                    {option}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.actionButton,
                styles.resetButton,
                { borderColor: theme.borderBrand, backgroundColor: theme.card },
              ]}
              onPress={handleReset}
              accessibilityRole="button"
              accessibilityLabel="Reset filter"
            >
              <AppText
                style={{
                  color: brand.primary,
                  fontFamily: fontFamily.semibold,
                  fontSize: 13,
                  lineHeight: 16,
                }}
              >
                Reset Filter
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.actionButton,
                styles.applyButton,
                taskSoftShadow(theme),
                { backgroundColor: brand.primary, borderColor: brand.primary },
              ]}
              onPress={handleApply}
              accessibilityRole="button"
              accessibilityLabel="Apply filter"
            >
              <AppText
                style={{
                  color: brand.onPrimary,
                  fontFamily: fontFamily.semibold,
                  fontSize: 13,
                  lineHeight: 16,
                }}
              >
                Apply Filter
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 13, 18, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    maxHeight: '72%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: spacing.md,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TASK_CHIP_GAP,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  option: {
    paddingHorizontal: TASK_CHIP_PADDING_H,
    paddingVertical: TASK_CHIP_PADDING_V,
    borderRadius: 999,
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  resetButton: {},
  applyButton: {},
});
