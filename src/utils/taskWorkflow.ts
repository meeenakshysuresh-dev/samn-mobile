import type {
  CreateTaskInput,
  Task,
  TaskActionKey,
  TaskStatus,
  TaskTimelineEvent,
  TaskViewerRole,
} from '../types/task.types';

export const SEED_CURRENT_USER = 'seed-current-user';

export const canAcceptTask = (task: Task, userId: string) =>
  task.status === 'open' && task.ownerId !== userId;

export const canEditTask = (task: Task, userId: string) =>
  task.ownerId === userId && task.status === 'open';

export const canDeleteTask = (task: Task, userId: string) =>
  task.ownerId === userId && task.status === 'open';

export const canStartTask = (task: Task, userId: string) =>
  task.workerId === userId && task.status === 'accepted';

export const canCompleteTask = (task: Task, userId: string) => {
  if (task.status !== 'in_progress') {
    return false;
  }
  return task.ownerId === userId || task.workerId === userId;
};

export const canCancelTask = (task: Task, userId: string) =>
  task.ownerId === userId && (task.status === 'open' || task.status === 'accepted');

export const canCancelAcceptance = (task: Task, userId: string) =>
  task.workerId === userId && task.status === 'accepted';

export const getTaskViewerRole = (task: Task, userId: string): TaskViewerRole => {
  if (task.ownerId === userId) {
    return 'owner';
  }
  if (task.workerId === userId) {
    return 'worker';
  }
  return 'viewer';
};

export const getTaskActions = (task: Task, userId: string): TaskActionKey[] => {
  const role = getTaskViewerRole(task, userId);
  const actions: TaskActionKey[] = [];

  if (role === 'viewer' && canAcceptTask(task, userId)) {
    actions.push('accept');
  }

  if (role === 'owner') {
    if (canEditTask(task, userId)) {
      actions.push('edit');
    }
    if (canDeleteTask(task, userId)) {
      actions.push('delete');
    }
    if (canCompleteTask(task, userId)) {
      actions.push('complete');
    }
    if (canCancelTask(task, userId)) {
      actions.push('cancelTask');
    }
  }

  if (role === 'worker') {
    if (canStartTask(task, userId)) {
      actions.push('start');
    }
    if (canCompleteTask(task, userId)) {
      actions.push('complete');
    }
    if (canCancelAcceptance(task, userId)) {
      actions.push('cancelAcceptance');
    }
  }

  return actions;
};

export const isBrowseableTask = (task: Task, userId: string) =>
  task.status === 'open' && task.ownerId !== userId;

export const createTimelineEvent = (
  status: TaskStatus,
  label: string,
  actorName?: string,
): TaskTimelineEvent => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  status,
  label,
  timestamp: new Date().toLocaleString(),
  actorName,
});

export const buildPostedDateLabel = (createdAt: string) => {
  const created = new Date(createdAt).getTime();
  const diffHours = Math.floor((Date.now() - created) / (1000 * 60 * 60));
  if (diffHours < 1) {
    return 'Just now';
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return new Date(createdAt).toLocaleDateString();
};

export const createTaskFromInput = (
  input: CreateTaskInput,
  ownerId: string,
  ownerName: string,
): Task => {
  const createdAt = new Date().toISOString();
  return {
    id: `task-${Date.now()}`,
    title: input.title.trim(),
    category: input.category,
    description: input.description.trim(),
    location: input.location.trim(),
    budget: input.budget,
    preferredDateTime: input.preferredDateTime.trim(),
    priority: input.priority,
    status: 'open',
    postedDate: buildPostedDateLabel(createdAt),
    createdAt,
    ownerId,
    ownerName,
    images: input.images ?? [],
    timeline: [createTimelineEvent('open', 'Task posted', ownerName)],
  };
};

export const validateTaskInput = (input: CreateTaskInput) => {
  const errors: Partial<Record<keyof CreateTaskInput, string>> = {};

  if (!input.title.trim()) {
    errors.title = 'Task title is required.';
  }
  if (!input.category) {
    errors.category = 'Please select a category.';
  }
  if (!input.description.trim()) {
    errors.description = 'Description is required.';
  }
  if (!input.location.trim()) {
    errors.location = 'Location is required.';
  }
  if (!input.budget || Number.isNaN(input.budget) || input.budget <= 0) {
    errors.budget = 'Enter a valid budget amount.';
  }
  if (!input.preferredDateTime.trim()) {
    errors.preferredDateTime = 'Preferred date and time is required.';
  }

  return errors;
};
