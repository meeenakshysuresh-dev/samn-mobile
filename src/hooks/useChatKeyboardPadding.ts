import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Keyboard, Platform, type KeyboardEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WINDOW_SHRINK_THRESHOLD = 48;
/** Base clearance so the composer sits comfortably above the keyboard (~40px). */
const BASE_KEYBOARD_CLEARANCE = 40;

/**
 * Returns an animated bottom padding that lifts a docked chat composer above the keyboard.
 *
 * The composer is a flex footer that already sits above the bottom tab bar (`tabBarInset`
 * from the screen bottom). When the keyboard opens we only need to cover the overlap
 * between the keyboard and that footer, i.e. `keyboardHeight - tabBarInset`.
 *
 * If Android `adjustResize` already shrank the window, no manual padding is added to
 * avoid double-lifting.
 */
export function useChatKeyboardPadding(tabBarInset: number): Animated.Value {
  const insets = useSafeAreaInsets();
  const padding = useRef(new Animated.Value(0)).current;
  const tabBarInsetRef = useRef(tabBarInset);
  const clearanceRef = useRef(BASE_KEYBOARD_CLEARANCE);
  const windowHeightRef = useRef(Dimensions.get('window').height);

  useEffect(() => {
    tabBarInsetRef.current = tabBarInset;
  }, [tabBarInset]);

  useEffect(() => {
    // Dynamic clearance: base gap plus the device's bottom safe-area inset.
    clearanceRef.current = BASE_KEYBOARD_CLEARANCE + Math.max(0, insets.bottom);
  }, [insets.bottom]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const animateTo = (toValue: number, duration: number) => {
      Animated.timing(padding, {
        toValue,
        duration: Math.max(duration, 0),
        useNativeDriver: false,
      }).start();
    };

    const onShow = (event: KeyboardEvent) => {
      const keyboardHeight = event.endCoordinates.height;
      const currentWindowHeight = Dimensions.get('window').height;
      const windowShrunk =
        windowHeightRef.current - currentWindowHeight > WINDOW_SHRINK_THRESHOLD;

      const overlap = windowShrunk
        ? 0
        : Math.max(0, keyboardHeight - tabBarInsetRef.current);

      // Add clearance so the whole composer clears the keyboard comfortably.
      const target = overlap + clearanceRef.current;

      animateTo(target, Platform.OS === 'ios' ? event.duration ?? 250 : 180);
    };

    const onHide = (event: KeyboardEvent) => {
      windowHeightRef.current = Dimensions.get('window').height;
      animateTo(0, Platform.OS === 'ios' ? event.duration ?? 250 : 180);
    };

    windowHeightRef.current = Dimensions.get('window').height;

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [padding]);

  return padding;
}
