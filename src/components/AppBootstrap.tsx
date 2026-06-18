import { useEffect } from 'react';

import { useSettingsStore } from '../hooks/useSettingsStore';
import { useThemeStore } from '../theme/useThemeStore';
import { NotificationBootstrap } from './NotificationBootstrap';

export const AppBootstrap = () => {
  useEffect(() => {
    const unsubscribeTheme = useThemeStore.getState().initialize();
    void useSettingsStore.getState().hydrate();

    return unsubscribeTheme;
  }, []);

  return <NotificationBootstrap />;
};
