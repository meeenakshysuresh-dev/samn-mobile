export const getFirstName = (fullName?: string | null): string => {
  const trimmed = fullName?.trim();
  if (!trimmed) {
    return 'there';
  }

  return trimmed.split(/\s+/)[0] ?? 'there';
};

export const getInitials = (fullName?: string | null): string => {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) {
    return '';
  }
  if (parts.length === 1) {
    return (parts[0][0] ?? '').toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
};
