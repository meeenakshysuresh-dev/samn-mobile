import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import type { IconName } from '../../../components/AppIcon/IconRegistry';

type QuickActionCardProps = {
  label: string;
  icon: IconName;
  onPress?: () => void;
};

export const QuickActionCard = ({ label, icon, onPress }: QuickActionCardProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.surfaceSecondary }]}>
        <AppIcon name={icon} width={20} height={20} color={brand.primary} />
      </View>
      <AppText
        preset="body"
        weight="semibold"
        style={{ color: theme.textPrimary, marginTop: spacing.sm }}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.lg,
    alignItems: 'flex-start',
    minHeight: 96,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
