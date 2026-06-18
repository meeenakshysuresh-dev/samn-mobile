import { create } from 'zustand';

import { fetchTasksForUser, mergeTaskLists } from '../services/task.service';
import type { Task } from '../types/task.types';
import { logError } from '../utils/errorLogger';
import { isBrowseableTask } from '../utils/taskWorkflow';

type TaskStoreState = {
  tasks: Task[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  syncedForUserId: string | null;
  applySync: (openTasks: Task[], postedTasks: Task[], acceptedTasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setError: (error: string | null) => void;
  refreshTasks: (userId: string) => Promise<void>;
  reset: () => void;
  getTaskById: (taskId: string) => Task | undefined;
  getBrowseableTasks: (userId: string) => Task[];
  getPostedTasks: (userId: string) => Task[];
  getAcceptedTasks: (userId: string) => Task[];
};

const initialState = {
  tasks: [] as Task[],
  loading: false,
  refreshing: false,
  error: null as string | null,
  syncedForUserId: null as string | null,
};

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  ...initialState,

  applySync: (openTasks, postedTasks, acceptedTasks) => {
    set({
      tasks: mergeTaskLists(openTasks, postedTasks, acceptedTasks),
      loading: false,
      error: null,
    });
  },

  setLoading: loading => set({ loading }),

  setRefreshing: refreshing => set({ refreshing }),

  setError: error => set({ error, loading: false }),

  refreshTasks: async userId => {
    set({ refreshing: true, error: null });
    try {
      const slices = await fetchTasksForUser(userId);
      get().applySync(slices.openTasks, slices.postedTasks, slices.acceptedTasks);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh tasks.';
      logError('useTaskStore.refreshTasks', error, { userId }, message);
      set({ error: message });
    } finally {
      set({ refreshing: false });
    }
  },

  reset: () => set({ ...initialState }),

  getTaskById: taskId => get().tasks.find(task => task.id === taskId),

  getBrowseableTasks: userId => get().tasks.filter(task => isBrowseableTask(task, userId)),

  getPostedTasks: userId => get().tasks.filter(task => task.ownerId === userId),

  getAcceptedTasks: userId =>
    get().tasks.filter(task => task.workerId === userId && task.ownerId !== userId),
}));
