export const getFirstName = (fullName?: string | null): string => {
  const trimmed = fullName?.trim();
  if (!trimmed) {
    return 'there';
  }

  return trimmed.split(/\s+/)[0] ?? 'there';
};
