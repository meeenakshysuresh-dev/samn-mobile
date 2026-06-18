import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { usePhotoPicker } from '../../../components/PhotoPicker/usePhotoPicker';
import { useAppTheme } from '../../../theme/useAppTheme';
import { spacing } from '../../../theme/tokens';

type TaskImageAttachmentsProps = {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
};

export const TaskImageAttachments = ({
  images,
  onChange,
  maxImages = 3,
}: TaskImageAttachmentsProps) => {
  const { theme } = useAppTheme();

  const photoPicker = usePhotoPicker({
    onPicked: result => {
      const uri = result.asset.uri;
      if (!uri || images.length >= maxImages) {
        return;
      }
      onChange([...images, uri]);
    },
  });

  const removeImage = (uri: string) => {
    onChange(images.filter(image => image !== uri));
  };

  return (
    <View style={styles.wrap}>
      <AppText preset="body" weight="semibold" style={{ color: theme.textPrimary, marginBottom: spacing.sm }}>
        Optional Images
      </AppText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {images.map(uri => (
          <View key={uri} style={styles.thumbWrap}>
            <Image source={{ uri }} style={[styles.thumb, { borderColor: theme.border }]} />
            <Pressable style={styles.removeBtn} onPress={() => removeImage(uri)}>
              <AppIcon name="x" width={14} height={14} color={theme.textInverse} />
            </Pressable>
          </View>
        ))}

        {images.length < maxImages ? (
          <Pressable
            style={[styles.addBox, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]}
            onPress={photoPicker.open}
          >
            <AppIcon name="camera" width={22} height={22} color={theme.textSecondary} />
            <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: spacing.xs }}>
              Add Photo
            </AppText>
          </Pressable>
        ) : null}
      </ScrollView>

      {photoPicker.PickerSheet}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  row: {
    gap: spacing.sm,
  },
  thumbWrap: {
    position: 'relative',
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBox: {
    width: 96,
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
