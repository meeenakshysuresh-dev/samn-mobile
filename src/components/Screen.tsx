import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../theme/useAppTheme';

export const Screen = ({ children }: PropsWithChildren) => {
  const { colors } = useAppTheme();

  return <View style={[styles.container, { backgroundColor: colors.background }]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
