import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { AppIcon } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { spacing } from '../../../theme/tokens';

type FabPostTaskProps = {
  onPress: () => void;
  bottomInset?: number;
};

export const FabPostTask = ({ onPress, bottomInset = 24 }: FabPostTaskProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={[styles.wrap, { bottom: bottomInset }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Post a task"
    >
      <LinearGradient
        colors={[...theme.gradientScanFab]}
        locations={[0.3, 1]}
        start={{ x: 0, y: 0.6 }}
        end={{ x: 1, y: 0.3 }}
        style={styles.button}
      >
        <AppIcon name="plus" width={24} height={24} color={theme.textInverse} />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: spacing.xl,
    zIndex: 10,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
