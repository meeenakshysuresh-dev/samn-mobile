import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';

type ChatComposerProps = {
  onSend: (text: string) => Promise<void>;
  sending: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export const ChatComposer = ({
  onSend,
  sending,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatComposerProps) => {
  const { theme } = useAppTheme();
  const [text, setText] = useState('');
  const canSend = Boolean(text.trim()) && !sending && !disabled;

  const handleSend = async () => {
    const value = text.trim();
    if (!value || sending || disabled) {
      return;
    }

    setText('');
    await onSend(value);
  };

  return (
    <View style={[styles.wrap, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
      <View style={styles.row}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          editable={!disabled && !sending}
          multiline
          blurOnSubmit={false}
          returnKeyType="default"
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
        />
        <Pressable
          style={[
            styles.sendButton,
            {
              backgroundColor: canSend ? brand.primary : theme.surfaceSecondary,
            },
          ]}
          onPress={() => {
            void handleSend();
          }}
          disabled={!canSend}
        >
          {sending ? (
            <ActivityIndicator color={brand.onPrimary} size="small" />
          ) : (
            <AppIcon
              name="arrowRight"
              size="sm"
              color={canSend ? brand.onPrimary : theme.textSecondary}
            />
          )}
        </Pressable>
      </View>
      {disabled ? (
        <AppText preset="caption" style={{ color: theme.textSecondary, marginTop: spacing.xs }}>
          Chat is read-only for completed or cancelled tasks.
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamily.regular,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
