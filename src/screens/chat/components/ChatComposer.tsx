import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppIcon, AppText } from '../../../components';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';

const MIN_INPUT_HEIGHT = 22;
const MAX_INPUT_HEIGHT = 100;
const INPUT_SHELL_MIN_HEIGHT = 48;
const SEND_BUTTON_SIZE = 40;
const COMPOSER_VERTICAL_PADDING = spacing.sm + spacing.md;

type ChatComposerProps = {
  onSend: (text: string) => Promise<void>;
  sending: boolean;
  disabled?: boolean;
  placeholder?: string;
  onLayout?: (height: number) => void;
};

export const ChatComposer = ({
  onSend,
  sending,
  disabled = false,
  placeholder = 'Message',
  onLayout,
}: ChatComposerProps) => {
  const { theme } = useAppTheme();
  const inputRef = useRef<TextInput>(null);

  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);

  const canSend = Boolean(text.trim()) && !sending && !disabled;
  const isMultiline = inputHeight > MIN_INPUT_HEIGHT + 4;

  const handleSend = useCallback(async () => {
    const value = text.trim();
    if (!value || sending || disabled) {
      return;
    }

    setText('');
    setInputHeight(MIN_INPUT_HEIGHT);
    await onSend(value);
  }, [disabled, onSend, sending, text]);

  const handleChangeText = useCallback((value: string) => {
    setText(value);
    if (!value.trim()) {
      setInputHeight(MIN_INPUT_HEIGHT);
    }
  }, []);

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const nextHeight = Math.min(
        MAX_INPUT_HEIGHT,
        Math.max(MIN_INPUT_HEIGHT, event.nativeEvent.contentSize.height),
      );
      setInputHeight(nextHeight);
    },
    [],
  );

  const reportLayout = useCallback(
    (height: number) => {
      onLayout?.(height);
    },
    [onLayout],
  );

  if (disabled) {
    return (
      <View
        onLayout={event => reportLayout(event.nativeEvent.layout.height)}
        style={[
          styles.wrap,
          styles.wrapShadow,
          {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            shadowColor: theme.shadowColor,
          },
        ]}
      >
        <View style={[styles.readOnlyBar, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <AppIcon name="lock" size="sm" color={theme.textSecondary} />
          <AppText preset="bodySmall" style={{ color: theme.textSecondary, flex: 1, marginLeft: spacing.sm }}>
            Chat is read-only for completed or cancelled tasks.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View
      onLayout={event => reportLayout(event.nativeEvent.layout.height)}
      style={[
        styles.wrap,
        styles.wrapShadow,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          shadowColor: theme.shadowColor,
        },
      ]}
    >
      <Pressable
        style={[
          styles.inputShell,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: focused ? brand.primary : theme.border,
            minHeight: INPUT_SHELL_MIN_HEIGHT,
          },
          focused && styles.inputShellFocused,
        ]}
        onPress={() => inputRef.current?.focus()}
      >
        <View style={styles.inputArea}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            editable={!sending}
            multiline
            blurOnSubmit={false}
            returnKeyType="default"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            textAlignVertical={isMultiline ? 'top' : 'center'}
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                height: Math.max(MIN_INPUT_HEIGHT, inputHeight),
              },
            ]}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor: canSend ? brand.primary : theme.card,
              borderColor: canSend ? brand.primary : theme.border,
              opacity: pressed && canSend ? 0.88 : 1,
              transform: [{ scale: pressed && canSend ? 0.94 : 1 }],
            },
          ]}
          onPress={() => {
            void handleSend();
          }}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !canSend }}
        >
          {sending ? (
            <ActivityIndicator color={brand.onPrimary} size="small" />
          ) : (
            <AppIcon
              name="send"
              width={18}
              height={18}
              color={canSend ? brand.onPrimary : theme.textSecondary}
              rtlFlip={false}
            />
          )}
        </Pressable>
      </Pressable>
    </View>
  );
};

/** Default composer height until onLayout reports the real value. */
export const CHAT_COMPOSER_DEFAULT_HEIGHT = INPUT_SHELL_MIN_HEIGHT + COMPOSER_VERTICAL_PADDING + StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  wrapShadow: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  inputShellFocused: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputArea: {
    flex: 1,
    justifyContent: 'center',
    minHeight: SEND_BUTTON_SIZE,
    paddingVertical: Platform.OS === 'android' ? 0 : 2,
  },
  input: {
    width: '100%',
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    paddingTop: Platform.OS === 'ios' ? 8 : 6,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    paddingHorizontal: 0,
    margin: 0,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  sendButton: {
    width: SEND_BUTTON_SIZE,
    height: SEND_BUTTON_SIZE,
    borderRadius: SEND_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 1,
  },
  readOnlyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: INPUT_SHELL_MIN_HEIGHT,
  },
});
