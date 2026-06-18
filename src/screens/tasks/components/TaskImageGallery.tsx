import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { spacing } from '../../../theme/tokens';

type TaskImageGalleryProps = {
  images: string[];
};

export const TaskImageGallery = ({ images }: TaskImageGalleryProps) => {
  const { theme } = useAppTheme();

  if (images.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
        <AppIcon name="image" width={20} height={20} color={theme.textSecondary} />
        <AppText preset="caption" style={{ color: theme.textSecondary, marginLeft: spacing.sm }}>
          No images attached
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {images.map(uri => (
        <Image key={uri} source={{ uri }} style={[styles.image, { borderColor: theme.border }]} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.lg,
  },
});
