export const formatPreferredDateTime = (date: Date): string =>
  date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const resolvePreferredDateTime = (value: string): Date => {
  const trimmed = value.trim();
  if (!trimmed) {
    return new Date();
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return new Date();
};

export const mergeDateAndTime = (datePart: Date, timePart: Date): Date => {
  const merged = new Date(datePart);
  merged.setHours(timePart.getHours(), timePart.getMinutes(), 0, 0);
  return merged;
};
