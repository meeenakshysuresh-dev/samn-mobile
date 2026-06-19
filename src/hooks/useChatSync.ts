import { useEffect } from 'react';

import { subscribeToUserChatRooms } from '../services/chat.service';
import { useChatStore } from '../store/useChatStore';
import { useTaskStore } from '../store/useTaskStore';
import { logError } from '../utils/errorLogger';

const isAuthenticatedUser = (userId: string | null | undefined): userId is string =>
  Boolean(userId && userId !== 'guest-user');

export const useChatSync = (userId: string | null | undefined) => {
  const tasks = useTaskStore(state => state.tasks);
  const applyRoomsSync = useChatStore(state => state.applyRoomsSync);
  const setLoading = useChatStore(state => state.setLoading);
  const setError = useChatStore(state => state.setError);
  const reset = useChatStore(state => state.reset);

  useEffect(() => {
    if (!isAuthenticatedUser(userId)) {
      reset();
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserChatRooms(
      tasks,
      userId,
      rooms => {
        applyRoomsSync(rooms);
      },
      error => {
        logError('useChatSync', error, { userId });
        setError(error.message);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [applyRoomsSync, reset, setError, setLoading, tasks, userId]);
};
