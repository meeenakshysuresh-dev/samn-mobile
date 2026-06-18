import React from 'react';
import { Platform, StatusBar } from 'react-native';

import { useAppTheme } from '../../theme/useAppTheme';

export const AppStatusBar = () => {
  const { theme } = useAppTheme();

  return (
    <StatusBar
      barStyle="light-content"
      backgroundColor={theme.headerStatusBar}
      translucent={Platform.OS === 'android'}
    />
  );
};
