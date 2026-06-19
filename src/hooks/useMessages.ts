import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ensureChatRoomForTask, CHAT_PERMISSION_DENIED_MESSAGE } from '../services/chat.service';
import {
  markRoomMessagesAsRead,
  markUndeliveredMessagesAsDelivered,
  sendTextMessage,
  subscribeToRoomMessages,
} from '../services/message.service';
import { useChatStore } from '../store/useChatStore';
import { useTaskStore } from '../store/useTaskStore';
import type { ChatMessage } from '../types/message.types';
import { logError } from '../utils/errorLogger';
import { canAccessTaskChat } from '../utils/taskWorkflow';

const EMPTY_MESSAGES: ChatMessage[] = [];

const isPermissionDenied = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const code = 'code' in error && typeof error.code === 'string' ? error.code : '';
  return code === 'firestore/permission-denied';
};

export const useMessages = (chatRoomId: string, userId: string) => {
  const selectMessages = useMemo(
    () => (state: ReturnType<typeof useChatStore.getState>) =>
      state.messagesByRoom[chatRoomId] ?? EMPTY_MESSAGES,
    [chatRoomId],
  );
  const messages = useChatStore(selectMessages);
  const setRoomMessages = useChatStore(state => state.setRoomMessages);
  const setActiveRoomId = useChatStore(state => state.setActiveRoomId);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const lastSyncedCountRef = useRef(0);

  useEffect(() => {
    if (!chatRoomId || userId === 'guest-user') {
      setReady(false);
      return;
    }

    let cancelled = false;

    const prepare = async () => {
      const task = useTaskStore.getState().getTaskById(chatRoomId);
      if (task && canAccessTaskChat(task, userId)) {
        try {
          await ensureChatRoomForTask(task);
        } catch (prepareError) {
          logError('useMessages.ensureChatRoom', prepareError, { chatRoomId, userId });
        }
      }
      if (!cancelled) {
        setReady(true);
      }
    };

    void prepare();

    return () => {
      cancelled = true;
      setReady(false);
    };
  }, [chatRoomId, userId]);

  useEffect(() => {
    if (!ready || !chatRoomId || userId === 'guest-user') {
      return;
    }

    setActiveRoomId(chatRoomId);
    lastSyncedCountRef.current = 0;

    const unsubscribe = subscribeToRoomMessages(
      chatRoomId,
      nextMessages => {
        setRoomMessages(chatRoomId, nextMessages);

        if (nextMessages.length === lastSyncedCountRef.current) {
          return;
        }
        lastSyncedCountRef.current = nextMessages.length;

        void markUndeliveredMessagesAsDelivered(chatRoomId, userId);
        void markRoomMessagesAsRead(chatRoomId, userId);
      },
      syncError => {
        logError('useMessages.subscribe', syncError, { chatRoomId, userId });
        setError(
          isPermissionDenied(syncError)
            ? CHAT_PERMISSION_DENIED_MESSAGE
            : syncError.message,
        );
      },
    );

    return () => {
      unsubscribe();
      setActiveRoomId(null);
    };
  }, [chatRoomId, ready, setActiveRoomId, setRoomMessages, userId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !chatRoomId) {
        return;
      }

      setSending(true);
      setError(null);
      try {
        const task = useTaskStore.getState().getTaskById(chatRoomId);
        if (task && canAccessTaskChat(task, userId)) {
          await ensureChatRoomForTask(task);
        }
        await sendTextMessage(chatRoomId, text);
      } catch (sendError) {
        const message = isPermissionDenied(sendError)
          ? CHAT_PERMISSION_DENIED_MESSAGE
          : sendError instanceof Error
            ? sendError.message
            : 'Failed to send message.';
        setError(message);
        logError('useMessages.send', sendError, { chatRoomId, userId });
      } finally {
        setSending(false);
      }
    },
    [chatRoomId, userId],
  );

  return { messages, sending, error, sendMessage, ready };
};
