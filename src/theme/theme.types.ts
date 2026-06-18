export type ThemePreference = 'light' | 'dark' | 'system';

export type AppThemeColors = {
  background: string;
  surface: string;
  border: string;
  text: string;
  mutedText: string;
  primary: string;
  success: string;
  danger: string;
  navigation: {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
    fonts: {
      regular: { fontFamily: string; fontWeight: '400' };
      medium: { fontFamily: string; fontWeight: '500' };
      bold: { fontFamily: string; fontWeight: '600' };
      heavy: { fontFamily: string; fontWeight: '700' };
    };
  };
};
