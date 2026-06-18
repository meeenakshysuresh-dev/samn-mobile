import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { spacing } from '../../../theme/tokens';

type SearchBarProps = {
  placeholder?: string;
  onPress?: () => void;
};

export const SearchBar = ({
  placeholder = 'Search tasks or services...',
  onPress,
}: SearchBarProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[styles.bar, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      accessibilityRole="search"
    >
      <AppIcon name="search" width={18} height={18} color={theme.textSecondary} />
      <AppText preset="body" style={{ color: theme.textSecondary, marginLeft: spacing.sm, flex: 1 }}>
        {placeholder}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
});
