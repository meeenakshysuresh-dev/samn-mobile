import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { useAppTheme } from '../theme/useAppTheme';

type Props = {
  label: string;
  icon?: string;
  disabled?: boolean;
  onPress: () => void;
};

export const Button = ({ label, icon, disabled, onPress }: Props) => {
  const { colors } = useAppTheme();

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.primary },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
    >
      {icon ? <Feather name={icon} size={18} color="#ffffff" /> : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
