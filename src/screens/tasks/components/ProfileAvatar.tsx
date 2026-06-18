import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily } from '../../../theme/tokens';
import { getInitials } from '../../../utils/userName';

type ProfileAvatarProps = {
  name?: string | null;
  size?: number;
  onPress?: () => void;
};

export const ProfileAvatar = ({ name, size = 40, onPress }: ProfileAvatarProps) => {
  const { theme } = useAppTheme();
  const initials = getInitials(name) || 'U';
  const fontSize = size * 0.38;

  const content = (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.surfaceSecondary,
          borderColor: theme.headerText,
        },
      ]}
    >
      <AppText
        style={{
          color: brand.primary,
          fontFamily: fontFamily.bold,
          fontSize,
        }}
      >
        {initials}
      </AppText>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Open profile">
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
