import React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppIcon } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import { TASK_SEARCH_FILTER_SIZE, TASK_SEARCH_HEIGHT, TASK_SEARCH_WIDTH_BLEED, taskSoftShadow } from '../taskUiStyles';

type TaskSearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  filterActive?: boolean;
};

export const TaskSearchField = ({
  value,
  onChangeText,
  placeholder = 'Search tasks...',
  onFilterPress,
  filterActive = false,
}: TaskSearchFieldProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.field,
          taskSoftShadow(theme),
          {
            backgroundColor: theme.card,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <View style={styles.searchIconWrap}>
          <AppIcon name="search" width={16} height={16} color={theme.textSecondary} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textPlaceholder}
          style={[styles.input, { color: theme.textPrimary }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
          importantForAutofill="no"
        />
        <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: filterActive ? brand.primary : theme.surfaceSecondary,
              borderColor: filterActive ? brand.primary : theme.borderSubtle,
            },
          ]}
          onPress={onFilterPress}
          disabled={!onFilterPress}
          accessibilityRole="button"
          accessibilityLabel="Open category filters"
        >
          <AppIcon name="filter" width={15} height={15} color={filterActive ? brand.onPrimary : brand.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    marginHorizontal: -TASK_SEARCH_WIDTH_BLEED,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: spacing.sm,
    paddingRight: 4,
    height: TASK_SEARCH_HEIGHT,
  },
  searchIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    paddingVertical: 0,
    paddingHorizontal: spacing.xs,
    margin: 0,
    height: TASK_SEARCH_HEIGHT,
    ...(Platform.OS === 'android' ? { includeFontPadding: false, textAlignVertical: 'center' } : null),
  },
  filterButton: {
    width: TASK_SEARCH_FILTER_SIZE - 2,
    height: TASK_SEARCH_FILTER_SIZE - 2,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
