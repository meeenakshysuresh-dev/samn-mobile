import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export const APP_LOGO = require('../../../assets/icons/samn-logo.png');
export const APP_WORDMARK = require('../../../assets/icons/samn-wordmark.png');

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

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 20,
  },
});
