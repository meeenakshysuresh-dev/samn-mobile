export const normalizeSkills = (skills: string[] | undefined | null): string[] => {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const skill of skills ?? []) {
    const trimmed = skill.trim();
    if (!trimmed) {
      continue;
    }

    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push(trimmed);
  }

  return normalized;
};

export const hasSkill = (skills: string[], candidate: string): boolean => {
  const key = candidate.trim().toLowerCase();
  return skills.some(skill => skill.trim().toLowerCase() === key);
};
