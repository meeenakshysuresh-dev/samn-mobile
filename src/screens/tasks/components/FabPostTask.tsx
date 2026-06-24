import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '../../../components';
import { brand } from '../../../theme/tokens';
import { spacing } from '../../../theme/tokens';

type FabPostTaskProps = {
  onPress: () => void;
  bottomInset?: number;
};

export const FabPostTask = ({ onPress, bottomInset = 24 }: FabPostTaskProps) => {
  return (
    <Pressable
      style={[styles.wrap, { bottom: bottomInset }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Post a task"
    >
      <View style={styles.button}>
        <AppIcon name="plus" width={24} height={24} color={brand.onPrimary} />
      </View>
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
    backgroundColor: brand.primary,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
