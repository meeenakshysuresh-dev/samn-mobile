import { Alert } from 'react-native';

export type ErrorDetails = {
  message: string;
  code?: string;
  stack?: string;
  raw: unknown;
};

const readErrorCode = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return undefined;
  }

  const code = error.code;
  return typeof code === 'string' ? code : undefined;
};

export const getErrorDetails = (error: unknown, fallback = 'Something went wrong.'): ErrorDetails => {
  if (error instanceof Error) {
    return {
      message: error.message || fallback,
      code: readErrorCode(error),
      stack: error.stack,
      raw: error,
    };
  }

  if (typeof error === 'string' && error.trim()) {
    return { message: error.trim(), raw: error };
  }

  return { message: fallback, raw: error };
};

export const logError = (
  scope: string,
  error: unknown,
  context?: Record<string, unknown>,
  fallbackMessage?: string,
): ErrorDetails => {
  const details = getErrorDetails(error, fallbackMessage);

  console.error(`[${scope}] ${details.message}`, {
    scope,
    code: details.code,
    context,
    stack: details.stack,
    error: details.raw,
  });

  return details;
};

export const showErrorAlert = (
  title: string,
  error: unknown,
  scope?: string,
  context?: Record<string, unknown>,
): void => {
  const details = logError(scope ?? title, error, context);
  Alert.alert(title, details.message);
};

export const logMessageError = (
  scope: string,
  message: string,
  context?: Record<string, unknown>,
): void => {
  console.error(`[${scope}] ${message}`, { scope, context });
};
