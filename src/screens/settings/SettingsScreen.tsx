import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../../components/Screen';
import { useAppTheme } from '../../theme/useAppTheme';
import { useThemeStore } from '../../theme/themeStore';
import type { ThemePreference } from '../../theme/theme.types';

const options: ThemePreference[] = ['light', 'dark', 'system'];

export const SettingsScreen = () => {
  const { colors, preference } = useAppTheme();
  const setPreference = useThemeStore(state => state.setPreference);

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Theme</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Choose a fixed theme or follow Android system appearance.
      </Text>

      <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {options.map(option => {
          const selected = option === preference;

          return (
            <Pressable
              key={option}
              style={[
                styles.option,
                { borderColor: colors.border },
                selected && { backgroundColor: colors.primary },
              ]}
              onPress={() => setPreference(option)}
            >
              {selected ? (
                <Text style={[styles.optionText, styles.selectedOptionText]}>{option}</Text>
              ) : (
                <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    fontSize: 16,
    lineHeight: 22,
  },
  group: {
    gap: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
});
