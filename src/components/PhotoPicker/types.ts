import type { Asset, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';

export type PhotoPickerSource = 'camera' | 'gallery';

export type PhotoPickerResult = {
  asset: Asset;
  assets: Asset[];
  source: PhotoPickerSource;
};

export type PhotoPickerOptions = {
  title?: string;
  subtitle?: string;
  selectionLimit?: number;
  camera?: Partial<CameraOptions>;
  library?: Partial<ImageLibraryOptions>;
};

export type UsePhotoPickerCallbacks = {
  onPicked?: (result: PhotoPickerResult) => void;
  onCancel?: () => void;
  onError?: (message: string, source: PhotoPickerSource | 'sheet') => void;
};
