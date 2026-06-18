import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../components';
import type { IconName } from '../../components/AppIcon/IconRegistry';
import { useAppTheme } from '../../theme/useAppTheme';

type SettingsMenuRowProps = {
  label: string;
  description?: string;
  icon: IconName;
  onPress: () => void;
  showDivider?: boolean;
};

export const SettingsMenuRow = ({
  label,
  description,
  icon,
  onPress,
  showDivider = true,
}: SettingsMenuRowProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[
        styles.row,
        showDivider && { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.surfaceSecondary }]}>
        <AppIcon name={icon} width={18} height={18} color={theme.primary} />
      </View>
      <View style={styles.textWrap}>
        <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary }}>
          {label}
        </AppText>
        {description ? (
          <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: 4 }}>
            {description}
          </AppText>
        ) : null}
      </View>
      <AppIcon name="chevronRight" width={18} height={18} color={theme.textMuted} rtlFlip />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
});
