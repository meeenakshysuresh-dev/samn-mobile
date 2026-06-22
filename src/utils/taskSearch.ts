import type { Task } from '../types/task.types';

const normalizeSearchText = (value: string | null | undefined): string =>
  (value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

export const normalizeTaskSearchQuery = (query: string): string => normalizeSearchText(query);

export const taskMatchesSearchQuery = (task: Task, query: string): boolean => {
  const normalizedQuery = normalizeTaskSearchQuery(query);
  if (!normalizedQuery) {
    return true;
  }

  const searchableFields = [
    task.title,
    task.category,
    task.location,
    task.description,
    task.ownerName,
    task.workerName,
  ];

  return searchableFields.some(field => normalizeSearchText(field).includes(normalizedQuery));
};
