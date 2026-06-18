import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { pick, errorCodes, isErrorWithCode, types } from '@react-native-documents/picker';
import type { Asset } from 'react-native-image-picker';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton, AppText, AppView, CommonHeader, Screen, SectionHeading, usePhotoPicker } from '../../components';
import type { RootStackParamList, UploadsStackParamList } from '../../navigation';
import { uploadFile, type UploadFilePart } from '../../services/uploadService';
import { useAppTheme } from '../../theme/useAppTheme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<UploadsStackParamList, 'Uploads'>,
  NativeStackScreenProps<RootStackParamList>
>;

const toImageFilePart = (asset: Asset): UploadFilePart | null => {
  if (!asset.uri) {
    return null;
  }

  return {
    uri: asset.uri,
    name: asset.fileName ?? 'image-upload.jpg',
    type: asset.type ?? 'image/jpeg',
  };
};

export const UploadsScreen = ({ navigation }: Props) => {
  const { theme } = useAppTheme();
  const [status, setStatus] = useState('No upload selected');
  const [isUploading, setIsUploading] = useState(false);

  const submitUpload = async (file: UploadFilePart) => {
    setIsUploading(true);
    setStatus(`Uploading ${file.name}`);

    try {
      const result = await uploadFile(file);
      setStatus(`Uploaded ${file.name}`);
      navigation.navigate('UploadDetails', { uploadId: result.id });
    } catch (error) {
      setStatus(`Upload failed for ${file.name}`);
      Alert.alert('Upload failed', error instanceof Error ? error.message : 'Unknown upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const { open: openPhotoPicker, PickerSheet } = usePhotoPicker(
    {
      onPicked: async ({ asset, source }) => {
        const file = toImageFilePart(asset);
        if (!file) {
          Alert.alert('No image selected', 'Please select an image with a valid file URI.');
          return;
        }
        setStatus(`Selected from ${source}`);
        await submitUpload(file);
      },
      onError: (message) => {
        Alert.alert('Photo picker error', message);
      },
    },
    {
      title: 'Add Photo',
      subtitle: 'Take a new photo or choose one from your gallery.',
    },
  );

  const chooseDocument = async () => {
    try {
      const [document] = await pick({
        type: [types.allFiles],
        allowMultiSelection: false,
      });

      await submitUpload({
        uri: document.uri,
        name: document.name ?? 'document-upload',
        type: document.type ?? 'application/octet-stream',
      });
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        return;
      }

      Alert.alert('Document picker error', error instanceof Error ? error.message : 'Unknown picker error');
    }
  };

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader title="Task Management" showBackButton={false} safeArea={false} />
      <Screen>
        <SectionHeading title="UPLOADS" />
        <AppText preset="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
          Pick an image from camera or gallery, or choose a document to upload.
        </AppText>

        <View style={[styles.panel, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <AppButton text="Choose Image" icon="image" disabled={isUploading} onPress={openPhotoPicker} />
        <AppButton text="Choose File" icon="file" disabled={isUploading} onPress={chooseDocument} />

        <View style={styles.statusRow}>
          {isUploading ? <ActivityIndicator color={theme.primary} /> : null}
          <AppText preset="body" style={styles.status}>
            {status}
          </AppText>
        </View>
      </View>

      {PickerSheet}
      </Screen>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    marginBottom: 22,
    lineHeight: 22,
  },
  panel: {
    gap: 14,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  statusRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  status: {
    flex: 1,
  },
});
