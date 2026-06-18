import { useEffect } from 'react';
import { Appearance } from 'react-native';

import { darkColors, lightColors } from './theme';
import { useThemeStore } from './themeStore';

export const useAppTheme = () => {
  const preference = useThemeStore(state => state.preference);
  const systemScheme = useThemeStore(state => state.systemScheme);
  const setSystemScheme = useThemeStore(state => state.setSystemScheme);
  const activeScheme = preference === 'system' ? systemScheme : preference;
  const colors = activeScheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription.remove();
  }, [setSystemScheme]);

  return {
    colors,
    isDark: activeScheme === 'dark',
    preference,
    activeScheme,
  };
};
