import { getStorage, ref } from '@react-native-firebase/storage';

import { STORAGE_PATHS } from './config';

export const userAvatarRef = (uid: string, fileName: string) =>
  ref(getStorage(), `${STORAGE_PATHS.userAvatars}/${uid}/${fileName}`);
