import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export const APP_LOGO = require('../../../assets/icons/samn-logo.png');
export const APP_WORDMARK = require('../../../assets/icons/samn-wordmark.png');

export const HEADER_LOGO_SIZE = 40;
export const HEADER_WORDMARK_WIDTH = 52;
export const HEADER_WORDMARK_HEIGHT = 44;

type AppLogoProps = {
  variant?: 'icon' | 'wordmark';
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export const AppLogo = ({ variant = 'icon', size = 120, style, imageStyle }: AppLogoProps) => {
  const source = variant === 'wordmark' ? APP_WORDMARK : APP_LOGO;
  const width = variant === 'wordmark' ? size * 1.6 : size;
  const height = size;

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={source}
        style={[styles.image, { width, height }, imageStyle]}
        resizeMode="contain"
        accessibilityLabel="SAMN logo"
      />
    </View>
  );
};

/** Square SAMN icon for the Tasks header. */
export const HeaderAppLogo = () => (
  <AppLogo size={HEADER_LOGO_SIZE} imageStyle={{ borderRadius: 10 }} />
);

/** SAMN wordmark for main tab headers (Home, Chat, Profile, Settings). */
export const HeaderAppWordmark = () => (
  <AppLogo
    variant="wordmark"
    size={HEADER_WORDMARK_HEIGHT}
    imageStyle={{
      borderRadius: 10,
      width: HEADER_WORDMARK_WIDTH,
      height: HEADER_WORDMARK_HEIGHT,
    }}
  />
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 20,
  },
});
