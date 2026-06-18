export const stripUndefined = <T extends Record<string, unknown>>(data: T): Partial<T> =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as Partial<T>;

export const pickDefinedFields = <T extends Record<string, unknown>, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Partial<Pick<T, K>> => {
  const result: Partial<Pick<T, K>> = {};

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
};
