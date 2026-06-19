import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, AppView, CommonHeader, KeyboardAvoiding } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useChatRoom, useChatRoomUnreadCount } from '../../hooks/useChats';
import { useMessages } from '../../hooks/useMessages';
import { useTabBarInset, TAB_BAR_DEFAULT_INSET } from '../../navigation/tabBarLayout';
import type { ChatStackParamList } from '../../navigation/RootNavigator.types';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/tokens';
import type { ChatMessage } from '../../types/message.types';
import { toChatListItem } from '../../utils/chatMapper';
import { TaskStatusBadge } from '../tasks/components/TaskStatusBadge';
import { ChatComposer } from './components/ChatComposer';
import { MessageBubble } from './components/MessageBubble';

type Nav = NativeStackNavigationProp<ChatStackParamList, 'ChatThread'>;
type Route = RouteProp<ChatStackParamList, 'ChatThread'>;

export const ChatThreadScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { user } = useAuth();
  const userId = user?.uid ?? 'guest-user';
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const chatRoomId = route.params.chatRoomId;
  const room = useChatRoom(chatRoomId);
  const threadUnreadCount = useChatRoomUnreadCount(chatRoomId, userId);
  const { messages, sending, error, sendMessage, ready } = useMessages(chatRoomId, userId);

  const listItem = room ? toChatListItem(room, userId) : null;
  const isReadOnly = room?.status !== 'active';
  const composerBottomInset = Math.max(tabBarInset, TAB_BAR_DEFAULT_INSET, insets.bottom);

  const scrollToLatest = useCallback((animated = true) => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated });
    }
  }, [messages.length]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const subscription = Keyboard.addListener(showEvent, () => {
      scrollToLatest(true);
    });
    return () => subscription.remove();
  }, [scrollToLatest]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble message={item} isOwn={item.senderUid === userId} />
    ),
    [userId],
  );

  if (!room) {
    return (
      <AppView style={[styles.container, { backgroundColor: theme.background }]}>
        <CommonHeader title="Chat" showBackButton onBack={() => navigation.goBack()} safeArea={false} />
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </AppView>
    );
  }

  return (
    <AppView style={[styles.container, { backgroundColor: theme.background }]}>
      <CommonHeader
        title={listItem?.otherParticipant.name ?? 'Chat'}
        subtitle={room.taskTitle}
        showBackButton
        onBack={() => navigation.goBack()}
        safeArea={false}
        rightContent={
          <View style={styles.headerRight}>
            {threadUnreadCount > 0 ? (
              <View style={[styles.headerUnreadBadge, { backgroundColor: theme.error }]}>
                <AppText preset="caption" weight="bold" style={{ color: theme.headerText, fontSize: 10 }}>
                  {threadUnreadCount > 9 ? '9+' : threadUnreadCount}
                </AppText>
              </View>
            ) : null}
            <TaskStatusBadge status={room.taskStatus} />
          </View>
        }
      />

      <KeyboardAvoiding style={styles.flex}>
        {error ? (
          <AppText preset="bodySmall" style={{ color: theme.error, paddingHorizontal: 20, paddingTop: spacing.sm }}>
            {error}
          </AppText>
        ) : null}

        {!ready ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={item => item.messageId}
            renderItem={renderItem}
            style={styles.flex}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: spacing.md },
              messages.length === 0 && styles.emptyList,
            ]}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={() => scrollToLatest(false)} tintColor={theme.primary} />
            }
            onContentSizeChange={() => scrollToLatest(false)}
            ListEmptyComponent={
              <AppText preset="body" style={{ color: theme.textSecondary, textAlign: 'center' }}>
                Start the conversation about this task.
              </AppText>
            }
          />
        )}

        <View style={{ paddingBottom: composerBottomInset }}>
          <ChatComposer onSend={sendMessage} sending={sending} disabled={isReadOnly} />
        </View>
      </KeyboardAvoiding>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingTop: spacing.md,
    flexGrow: 1,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: 4,
  },
  headerUnreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});
