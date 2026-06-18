import { Appearance } from 'react-native';
import { create } from 'zustand';

import type { ThemePreference } from './theme.types';

type ThemeState = {
  preference: ThemePreference;
  systemScheme: 'light' | 'dark';
  setPreference: (preference: ThemePreference) => void;
  setSystemScheme: (scheme: 'light' | 'dark') => void;
};

const initialScheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

export const useThemeStore = create<ThemeState>(set => ({
  preference: 'system',
  systemScheme: initialScheme,
  setPreference: preference => set({ preference }),
  setSystemScheme: systemScheme => set({ systemScheme }),
}));
