import { Platform, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { useAppTheme } from '../theme/useAppTheme';

export const useHeaderStatusBar = () => {
  const { theme } = useAppTheme();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(theme.headerStatusBar);
        StatusBar.setTranslucent(true);
      }
    }, [theme.headerStatusBar]),
  );
};
