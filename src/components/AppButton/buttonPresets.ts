import { brand } from '../../theme/tokens';
import { AppTheme } from '../../theme/themes';

export interface ButtonPresetResult {
  backgroundColor?: string;
  textColor: string;
  borderColor?: string;
  isGradient?: boolean;
  gradientColors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  gradientLocations?: number[];
}

const filledPrimary = (): ButtonPresetResult => ({
  backgroundColor: brand.primary,
  textColor: brand.onPrimary,
  borderColor: brand.primary,
  isGradient: false,
});

export const buttonPresets = {
  primary: (_theme: AppTheme): ButtonPresetResult => filledPrimary(),

  secondary: (theme: AppTheme): ButtonPresetResult => ({
    backgroundColor: 'transparent',
    textColor: brand.primary,
    borderColor: brand.primary,
    isGradient: false,
  }),

  small: (_theme: AppTheme): ButtonPresetResult => filledPrimary(),

  inline: (theme: AppTheme): ButtonPresetResult => ({
    backgroundColor: 'transparent',
    textColor: brand.primary,
    borderColor: 'transparent',
    isGradient: false,
  }),

  gradientPrimary: (_theme: AppTheme): ButtonPresetResult => filledPrimary(),

  gradientSecondary: (_theme: AppTheme): ButtonPresetResult => filledPrimary(),

  gradientDisabled: (_theme: AppTheme): ButtonPresetResult => ({
    textColor: '#F9FAFB',
    isGradient: true,
    gradientColors: ['#9CA3AF', '#6B7280'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  }),

  danger: (theme: AppTheme): ButtonPresetResult => ({
    backgroundColor: '#F44336',
    textColor: '#fff',
    borderColor: '#F44336',
  }),
};
