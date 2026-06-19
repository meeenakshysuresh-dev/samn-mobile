import React, { createContext, useContext, useMemo } from 'react';

import { useAuth } from '../hooks/useAuth';
import { useChatSync } from '../hooks/useChatSync';

type ChatContextValue = {
  userId: string;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.uid ?? 'guest-user';

  useChatSync(user?.uid ?? null);

  const value = useMemo(() => ({ userId }), [userId]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};
