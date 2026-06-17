import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;
type PermissionStatus = 'loading' | 'granted' | 'denied';

const isAndroid = Platform.OS === 'android';

export const CameraScreen = ({ navigation }: Props) => {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('loading');

  const requestCameraPermission = useCallback(async () => {
    setPermissionStatus('loading');

    if (!isAndroid) {
      setPermissionStatus('denied');
      return;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera permission',
        message: 'Allow camera access to show the preview.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    setPermissionStatus(
      result === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied',
    );
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  if (permissionStatus === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.stateText}>Checking camera permission...</Text>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <View style={styles.centered}>
        <Ionicons name="camera-outline" size={44} color="#334155" />
        <Text style={styles.title}>Camera permission denied</Text>
        <Text style={styles.description}>
          Grant camera permission to show the Android camera preview.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={requestCameraPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={navigation.goBack}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.previewContainer}>
      <Camera
        style={styles.camera}
        cameraType={CameraType.Back}
        flashMode="off"
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Home"
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={navigation.goBack}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  stateText: {
    marginTop: 14,
    color: '#334155',
    fontSize: 16,
  },
  title: {
    marginTop: 12,
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    marginBottom: 24,
    color: '#475569',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: '#2563eb',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 16,
    padding: 12,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
  },
});
