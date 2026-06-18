import type { AppThemeColors } from './theme.types';

const fonts = {
  regular: { fontFamily: 'System', fontWeight: '400' as const },
  medium: { fontFamily: 'System', fontWeight: '500' as const },
  bold: { fontFamily: 'System', fontWeight: '600' as const },
  heavy: { fontFamily: 'System', fontWeight: '700' as const },
};

export const lightColors: AppThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#dbe3ef',
  text: '#0f172a',
  mutedText: '#64748b',
  primary: '#2563eb',
  success: '#138a53',
  danger: '#dc2626',
  navigation: {
    dark: false,
    colors: {
      primary: '#2563eb',
      background: '#f8fafc',
      card: '#ffffff',
      text: '#0f172a',
      border: '#dbe3ef',
      notification: '#dc2626',
    },
    fonts,
  },
};

export const darkColors: AppThemeColors = {
  background: '#111827',
  surface: '#1f2937',
  border: '#374151',
  text: '#f9fafb',
  mutedText: '#a7b0bf',
  primary: '#60a5fa',
  success: '#4ade80',
  danger: '#f87171',
  navigation: {
    dark: true,
    colors: {
      primary: '#60a5fa',
      background: '#111827',
      card: '#1f2937',
      text: '#f9fafb',
      border: '#374151',
      notification: '#f87171',
    },
    fonts,
  },
};
