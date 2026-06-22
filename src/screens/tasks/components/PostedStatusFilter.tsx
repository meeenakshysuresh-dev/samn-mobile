import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '../../../components';
import { POSTED_TASK_FILTER_TABS } from '../../../constants/tasks';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily } from '../../../theme/tokens';
import type { PostedTaskFilterTab } from '../../../types/task.types';
import {
  TASK_CHIP_GAP,
  TASK_CHIP_PADDING_H,
  TASK_CHIP_PADDING_V,
  TASK_CHIP_SCROLL_PADDING_H,
  TASK_SCREEN_HORIZONTAL_PADDING,
  taskSoftShadow,
} from '../taskUiStyles';

type PostedStatusFilterProps = {
  value: PostedTaskFilterTab;
  onChange: (value: PostedTaskFilterTab) => void;
};

export const PostedStatusFilter = ({ value, onChange }: PostedStatusFilterProps) => {
  const { theme } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {POSTED_TASK_FILTER_TABS.map(tab => {
        const selected = value === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[
              styles.chip,
              selected
                ? [{ backgroundColor: brand.primary, borderColor: brand.primary }, taskSoftShadow(theme)]
                : {
                    backgroundColor: theme.card,
                    borderColor: theme.borderBrand,
                  },
            ]}
            onPress={() => onChange(tab.key)}
          >
            <AppText
              style={{
                color: selected ? brand.onPrimary : brand.primary,
                fontFamily: fontFamily.semibold,
                fontSize: 11,
                lineHeight: 14,
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
  scroll: {
    marginHorizontal: -TASK_SCREEN_HORIZONTAL_PADDING,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: TASK_CHIP_GAP,
    paddingHorizontal: TASK_CHIP_SCROLL_PADDING_H,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: TASK_CHIP_PADDING_H,
    paddingVertical: TASK_CHIP_PADDING_V,
    borderRadius: 999,
    borderWidth: 1,
    marginVertical:10
  },
});
