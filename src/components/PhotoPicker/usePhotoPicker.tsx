import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

import { PhotoPickerSheet } from './PhotoPicker';
import type {
  PhotoPickerOptions,
  PhotoPickerResult,
  PhotoPickerSource,
  UsePhotoPickerCallbacks,
} from './types';

async function ensureCameraPermissionAndroid(): Promise<{
  granted: boolean;
  reason?: string;
}> {
  if (Platform.OS !== 'android') {
    return { granted: true };
  }

  try {
    const already = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (already) {
      return { granted: true };
    }

    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera Permission',
      message: 'Allow camera access to capture photos.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    });

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return { granted: true };
    }
    if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return {
        granted: false,
        reason: 'Camera permission is permanently denied. Enable it from app settings.',
      };
    }
    return { granted: false, reason: 'Camera permission denied.' };
  } catch (error: unknown) {
    return {
      granted: false,
      reason: error instanceof Error ? error.message : 'Failed to request camera permission.',
    };
  }
}

const DEFAULT_CAMERA: CameraOptions = {
  mediaType: 'photo',
  cameraType: 'back',
  saveToPhotos: false,
  quality: 0.8,
  includeBase64: false,
};

const DEFAULT_LIBRARY: ImageLibraryOptions = {
  mediaType: 'photo',
  selectionLimit: 1,
  quality: 0.8,
  includeBase64: false,
};

function resolveSelectionLimit(value: number | undefined): number {
  if (value === undefined) {
    return 1;
  }
  if (value <= 0) {
    return 0;
  }
  return Math.floor(value);
}

export type UsePhotoPickerReturn = {
  open: () => void;
  close: () => void;
  openCamera: () => Promise<void>;
  openGallery: () => Promise<void>;
  isOpen: boolean;
  lastResult: PhotoPickerResult | null;
  PickerSheet: React.ReactElement;
};

export function usePhotoPicker(
  callbacks: UsePhotoPickerCallbacks = {},
  options: PhotoPickerOptions = {},
): UsePhotoPickerReturn {
  const [visible, setVisible] = useState(false);
  const [lastResult, setLastResult] = useState<PhotoPickerResult | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const cameraOptions = useMemo<CameraOptions>(
    () => ({ ...DEFAULT_CAMERA, ...(options.camera ?? {}) }),
    [options.camera],
  );

  const libraryOptions = useMemo<ImageLibraryOptions>(
    () => ({
      ...DEFAULT_LIBRARY,
      selectionLimit: resolveSelectionLimit(options.selectionLimit),
      ...(options.library ?? {}),
    }),
    [options.selectionLimit, options.library],
  );

  const open = useCallback(() => setVisible(true), []);

  const close = useCallback(() => {
    setVisible(false);
    callbacksRef.current.onCancel?.();
  }, []);

  const handleSuccess = useCallback((result: PhotoPickerResult) => {
    setLastResult(result);
    callbacksRef.current.onPicked?.(result);
  }, []);

  const handleError = useCallback((message: string, source: PhotoPickerSource | 'sheet') => {
    callbacksRef.current.onError?.(message, source);
  }, []);

  const openCamera = useCallback(async () => {
    setVisible(false);
    try {
      const perm = await ensureCameraPermissionAndroid();
      if (!perm.granted) {
        handleError(perm.reason || 'Camera permission denied.', 'camera');
        return;
      }

      const result = await launchCamera(cameraOptions);
      if (result.didCancel) {
        callbacksRef.current.onCancel?.();
        return;
      }
      if (result.errorCode) {
        handleError(result.errorMessage || 'Unable to open the camera.', 'camera');
        return;
      }
      const assets = result.assets ?? [];
      if (assets.length > 0) {
        handleSuccess({ asset: assets[0], assets, source: 'camera' });
      }
    } catch (error: unknown) {
      handleError(error instanceof Error ? error.message : 'Failed to open camera.', 'camera');
    }
  }, [cameraOptions, handleError, handleSuccess]);

  const openGallery = useCallback(async () => {
    setVisible(false);
    try {
      const result = await launchImageLibrary(libraryOptions);
      if (result.didCancel) {
        callbacksRef.current.onCancel?.();
        return;
      }
      if (result.errorCode) {
        handleError(result.errorMessage || 'Unable to open the gallery.', 'gallery');
        return;
      }
      const assets = result.assets ?? [];
      if (assets.length > 0) {
        handleSuccess({ asset: assets[0], assets, source: 'gallery' });
      }
    } catch (error: unknown) {
      handleError(error instanceof Error ? error.message : 'Failed to open gallery.', 'gallery');
    }
  }, [libraryOptions, handleError, handleSuccess]);

  const PickerSheet = (
    <PhotoPickerSheet
      visible={visible}
      title={options.title}
      subtitle={options.subtitle}
      onClose={close}
      onSelectCamera={openCamera}
      onSelectGallery={openGallery}
    />
  );

  return {
    open,
    close,
    openCamera,
    openGallery,
    isOpen: visible,
    lastResult,
    PickerSheet,
  };
}
