import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../../../components';
import type { ChatMessage } from '../../../types/message.types';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import { formatMessageTime } from '../../../utils/formatChatTime';
import { getMessageDeliveryStatus } from '../../../types/message.types';

type MessageBubbleProps = {
  message: ChatMessage;
  isOwn: boolean;
};

const statusLabel = (message: ChatMessage): string => {
  const status = getMessageDeliveryStatus(message);
  if (status === 'read') {
    return 'Read';
  }
  if (status === 'delivered') {
    return 'Delivered';
  }
  return 'Sent';
};

export const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.wrap, isOwn ? styles.ownWrap : styles.otherWrap]}>
      <View
        style={[
          styles.bubble,
          isOwn
            ? { backgroundColor: brand.primary, borderBottomRightRadius: 4 }
            : {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
                borderWidth: 1,
                borderBottomLeftRadius: 4,
              },
        ]}
      >
        <AppText
          preset="body"
          style={{
            color: isOwn ? brand.onPrimary : theme.textPrimary,
            lineHeight: 22,
          }}
        >
          {message.message}
        </AppText>
        <View style={styles.metaRow}>
          <AppText
            preset="caption"
            style={{
              color: isOwn ? brand.onPrimaryMuted : theme.textSecondary,
              fontSize: 10,
            }}
          >
            {formatMessageTime(message.createdAt)}
          </AppText>
          {isOwn ? (
            <AppText
              preset="caption"
              style={{
                color: brand.onPrimaryMuted,
                fontFamily: fontFamily.medium,
                fontSize: 10,
                marginLeft: spacing.sm,
              }}
            >
              {statusLabel(message)}
            </AppText>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
    paddingHorizontal: 20,
  },
  ownWrap: {
    alignItems: 'flex-end',
  },
  otherWrap: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
