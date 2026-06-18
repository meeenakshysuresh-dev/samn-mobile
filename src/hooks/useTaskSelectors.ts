import { useMemo } from 'react';

import { useTaskStore } from '../store/useTaskStore';
import { isBrowseableTask } from '../utils/taskWorkflow';

export const useTasks = () => useTaskStore(state => state.tasks);

export const useTaskById = (taskId: string) => {
  const tasks = useTaskStore(state => state.tasks);
  return useMemo(() => tasks.find(task => task.id === taskId), [tasks, taskId]);
};

export const useBrowseableTasks = (userId: string) => {
  const tasks = useTaskStore(state => state.tasks);
  return useMemo(
    () => tasks.filter(task => isBrowseableTask(task, userId)),
    [tasks, userId],
  );
};

export const usePostedTasks = (userId: string) => {
  const tasks = useTaskStore(state => state.tasks);
  return useMemo(() => tasks.filter(task => task.ownerId === userId), [tasks, userId]);
};

export const useAcceptedTasks = (userId: string) => {
  const tasks = useTaskStore(state => state.tasks);
  return useMemo(
    () => tasks.filter(task => task.workerId === userId && task.ownerId !== userId),
    [tasks, userId],
  );
};

export const useOpenTasks = () => {
  const tasks = useTaskStore(state => state.tasks);
  return useMemo(() => tasks.filter(task => task.status === 'open'), [tasks]);
};

export const useTaskLoading = () => useTaskStore(state => state.loading);
export const useTaskRefreshing = () => useTaskStore(state => state.refreshing);
export const useTaskError = () => useTaskStore(state => state.error);
