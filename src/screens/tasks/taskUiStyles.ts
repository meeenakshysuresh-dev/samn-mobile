import { Platform, type ViewStyle } from 'react-native';

import type { AppTheme } from '../../theme/themes';

/** Horizontal inset for task screen content (header controls, cards). */
export const TASK_SCREEN_HORIZONTAL_PADDING = 14;

export const TASK_GRID_GAP = 10;

export const TASK_SEGMENT_TRACK_PADDING = 3;
export const TASK_SEGMENT_HEIGHT = 40;
export const TASK_SEGMENT_TAB_HEIGHT = 34;
export const TASK_SEGMENT_RADIUS = 12;
export const TASK_SEGMENT_TAB_RADIUS = 10;

export const TASK_CHIP_GAP = 6;
export const TASK_CHIP_PADDING_H = 15;
export const TASK_CHIP_PADDING_V = 6;
/** Extra horizontal inset for edge-to-edge chip scroll rows. */
export const TASK_CHIP_SCROLL_PADDING_H = TASK_SCREEN_HORIZONTAL_PADDING -6;

export const TASK_SEARCH_HEIGHT = 42;
export const TASK_SEARCH_FILTER_SIZE = 32;
/** Extra width per side — search bar extends symmetrically beyond the controls column. */
export const TASK_SEARCH_WIDTH_BLEED = 12;

export const taskSoftShadow = (theme: AppTheme, elevated = false): ViewStyle =>
  Platform.select({
    ios: {
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: elevated ? 4 : 2 },
      shadowOpacity: elevated ? theme.shadowOpacityMd : theme.shadowOpacitySm,
      shadowRadius: elevated ? 8 : 5,
    },
    android: {
      elevation: elevated ? 4 : 2,
    },
  }) ?? {};

export const taskInsetShadow = (theme: AppTheme): ViewStyle => ({
  backgroundColor: theme.surfaceTertiary,
  borderWidth: 1,
  borderColor: theme.borderSubtle,
  ...Platform.select({
    ios: {
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 1,
    },
    android: {
      elevation: 0,
    },
  }),
});
