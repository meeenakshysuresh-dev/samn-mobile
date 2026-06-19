import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components';
import type { ChatListItem } from '../../../types/chat.types';
import { useAppTheme } from '../../../theme/useAppTheme';
import { brand, fontFamily, spacing } from '../../../theme/tokens';
import { formatChatListTime } from '../../../utils/formatChatTime';
import { TaskStatusBadge } from '../../tasks/components/TaskStatusBadge';
import { ChatParticipantAvatar } from './ChatParticipantAvatar';

type ChatListItemRowProps = {
  item: ChatListItem;
  onPress: () => void;
};

export const ChatListItemRow = ({ item, onPress }: ChatListItemRowProps) => {
  const { theme } = useAppTheme();
  const preview = item.lastMessage || 'No messages yet';
  const hasUnread = item.unreadCount > 0;

  return (
    <Pressable
      style={[
        styles.row,
        {
          borderBottomColor: theme.border,
          backgroundColor: hasUnread ? theme.surfaceSecondary : theme.card,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.avatarWrap}>
        <ChatParticipantAvatar name={item.otherParticipant.name} photoUrl={item.otherParticipant.photoUrl} />
        {hasUnread ? (
          <View style={[styles.avatarBadge, { backgroundColor: theme.error, borderColor: theme.card }]}>
            <AppText style={styles.avatarBadgeText}>
              {item.unreadCount > 9 ? '9+' : item.unreadCount}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText
            preset="body"
            weight="semibold"
            numberOfLines={1}
            style={{ color: theme.textPrimary, flex: 1 }}
          >
            {item.otherParticipant.name}
          </AppText>
          <AppText
            preset="caption"
            style={{
              color: hasUnread ? brand.primary : theme.textSecondary,
              marginLeft: spacing.sm,
              fontFamily: hasUnread ? fontFamily.semibold : fontFamily.regular,
            }}
          >
            {formatChatListTime(item.lastMessageAt)}
          </AppText>
        </View>

        <AppText
          preset="bodySmall"
          numberOfLines={1}
          weight={hasUnread ? 'semibold' : 'normal'}
          style={{ color: hasUnread ? theme.textPrimary : theme.textSecondary, marginTop: 2 }}
        >
          {item.taskTitle}
        </AppText>

        <View style={styles.bottomRow}>
          <AppText
            preset="bodySmall"
            numberOfLines={1}
            weight={hasUnread ? 'semibold' : 'normal'}
            style={{
              color: hasUnread ? theme.textPrimary : theme.textSecondary,
              flex: 1,
              marginTop: 4,
            }}
          >
            {preview}
          </AppText>
          <TaskStatusBadge status={item.taskStatus} />
        </View>
      </View>

      {hasUnread ? (
        <View style={[styles.countBadge, { backgroundColor: brand.primary }]}>
          <AppText style={styles.countBadgeText}>
            {item.unreadCount > 99 ? '99+' : item.unreadCount}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  avatarBadgeText: {
    color: brand.onPrimary,
    fontFamily: fontFamily.bold,
    fontSize: 10,
    lineHeight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {
    color: brand.onPrimary,
    fontFamily: fontFamily.bold,
    fontSize: 11,
    lineHeight: 14,
  },
});
