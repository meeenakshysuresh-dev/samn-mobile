import { useCallback, useEffect } from 'react';

import { subscribeToTasksForUser } from '../services/task.service';
import { useTaskStore } from '../store/useTaskStore';
import { logError } from '../utils/errorLogger';

const isAuthenticatedUser = (userId: string | null | undefined): userId is string =>
  Boolean(userId && userId !== 'guest-user');

export const useTaskSync = (userId: string | null | undefined) => {
  const applySync = useTaskStore(state => state.applySync);
  const setLoading = useTaskStore(state => state.setLoading);
  const setError = useTaskStore(state => state.setError);
  const reset = useTaskStore(state => state.reset);

  useEffect(() => {
    if (!isAuthenticatedUser(userId)) {
      reset();
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTasksForUser(
      userId,
      slices => {
        applySync(slices.openTasks, slices.postedTasks, slices.acceptedTasks);
        useTaskStore.setState({ syncedForUserId: userId });
      },
      error => {
        logError('useTaskSync', error, { userId });
        setError(error.message);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [applySync, reset, setError, setLoading, userId]);
};

export const useRefreshTasks = () => {
  const refreshTasks = useTaskStore(state => state.refreshTasks);
  const refreshing = useTaskStore(state => state.refreshing);

  const refresh = useCallback(
    async (userId: string) => {
      if (!isAuthenticatedUser(userId)) {
        return;
      }
      await refreshTasks(userId);
    },
    [refreshTasks],
  );

  return { refresh, refreshing };
};

export const useTaskLoadingState = () => ({
  loading: useTaskStore(state => state.loading),
  refreshing: useTaskStore(state => state.refreshing),
  error: useTaskStore(state => state.error),
});
