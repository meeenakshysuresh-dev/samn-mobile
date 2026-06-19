import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';

type ChatParticipantAvatarProps = {
  name: string;
  photoUrl?: string;
  size?: number;
  showOnline?: boolean;
};

export const ChatParticipantAvatar = ({
  name,
  photoUrl,
  size = 48,
  showOnline = false,
}: ChatParticipantAvatarProps) => {
  const { theme } = useAppTheme();
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={{ width: size, height: size }}>
      {photoUrl ? (
        <Image
          source={{ uri: photoUrl }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <AppText style={{ color: brand.primary, fontFamily: fontFamily.bold, fontSize: size * 0.38 }}>
            {initial}
          </AppText>
        </View>
      )}
      {showOnline ? (
        <View
          style={[
            styles.onlineDot,
            {
              backgroundColor: theme.success,
              borderColor: theme.card,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});
