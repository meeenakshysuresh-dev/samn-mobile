import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import type { IconName } from '../../../components/AppIcon/IconRegistry';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import { taskSoftShadow } from '../taskUiStyles';

type TaskCardActionButtonProps = {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'filled' | 'outline';
  style?: object;
};

export const TaskCardActionButton = ({
  label,
  icon,
  onPress,
  loading = false,
  variant = 'filled',
  style,
}: TaskCardActionButtonProps) => {
  const { theme } = useAppTheme();
  const isFilled = variant === 'filled';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isFilled
          ? [taskSoftShadow(theme), { backgroundColor: brand.primary, borderColor: brand.primary }]
          : { backgroundColor: theme.card, borderColor: theme.borderBrand },
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={!onPress || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? brand.onPrimary : brand.primary} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <AppIcon
              name={icon}
              width={15}
              height={15}
              color={isFilled ? brand.onPrimary : brand.primary}
            />
          ) : null}
          <AppText
            preset="label"
            numberOfLines={1}
            style={{
              color: isFilled ? brand.onPrimary : brand.primary,
              fontFamily: fontFamily.semibold,
              fontSize: 13,
              marginLeft: icon ? 6 : 0,
            }}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
