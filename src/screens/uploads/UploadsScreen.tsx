import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { pick, errorCodes, isErrorWithCode, types } from '@react-native-documents/picker';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
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
  const { colors } = useAppTheme();
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

  const chooseImage = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });

    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      Alert.alert('Image picker error', response.errorMessage);
      return;
    }

    const file = response.assets?.[0] ? toImageFilePart(response.assets[0]) : null;

    if (!file) {
      Alert.alert('No image selected', 'Please select an image with a valid file URI.');
      return;
    }

    await submitUpload(file);
  };

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
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Uploads</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Pick an image or document and upload it with axios multipart.
      </Text>

      <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Button label="Choose Image" icon="image" disabled={isUploading} onPress={chooseImage} />
        <Button label="Choose File" icon="file" disabled={isUploading} onPress={chooseDocument} />

        <View style={styles.statusRow}>
          {isUploading ? <ActivityIndicator color={colors.primary} /> : null}
          <Text style={[styles.status, { color: colors.text }]}>{status}</Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    fontSize: 16,
    lineHeight: 22,
  },
  panel: {
    gap: 14,
    borderWidth: 1,
    borderRadius: 8,
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
    fontSize: 15,
  },
});
