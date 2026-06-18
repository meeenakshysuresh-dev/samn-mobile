import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { useThemeStore } from '../theme/useThemeStore';

const STORAGE_KEY = '@samn/app-settings';

type PersistedSettings = {
  darkModeEnabled: boolean;
  pushNotificationsEnabled: boolean;
};

type SettingsState = PersistedSettings & {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setDarkModeEnabled: (enabled: boolean) => Promise<void>;
  setPushNotificationsEnabled: (enabled: boolean) => Promise<void>;
};

const persistSettings = async (settings: PersistedSettings) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  darkModeEnabled: false,
  pushNotificationsEnabled: true,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
        const darkModeEnabled = parsed.darkModeEnabled ?? false;
        const pushNotificationsEnabled = parsed.pushNotificationsEnabled ?? true;

        set({ darkModeEnabled, pushNotificationsEnabled, hydrated: true });
        useThemeStore.getState().setMode(darkModeEnabled ? 'dark' : 'light');
        return;
      }
    } catch {
      // fall through to defaults
    }

    set({ hydrated: true });
  },

  setDarkModeEnabled: async enabled => {
    set({ darkModeEnabled: enabled });
    useThemeStore.getState().setMode(enabled ? 'dark' : 'light');

    const { pushNotificationsEnabled } = get();
    await persistSettings({ darkModeEnabled: enabled, pushNotificationsEnabled });
  },

  setPushNotificationsEnabled: async enabled => {
    set({ pushNotificationsEnabled: enabled });

    const { darkModeEnabled } = get();
    await persistSettings({ darkModeEnabled, pushNotificationsEnabled: enabled });
  },
}));
