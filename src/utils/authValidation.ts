export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: 'Email address is required.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Password must include upper, lower case letters and a number.',
    };
  }
  return { valid: true };
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }
  return { valid: true };
};

export const validateFullName = (fullName: string): ValidationResult => {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { valid: false, error: 'Full name is required.' };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Please enter your full name.' };
  }
  return { valid: true };
};

export const validateRegisterForm = (input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult => {
  const checks = [
    validateFullName(input.fullName),
    validateEmail(input.email),
    validatePassword(input.password),
    validateConfirmPassword(input.password, input.confirmPassword),
  ];

  return checks.find(result => !result.valid) ?? { valid: true };
};

export const validateLoginForm = (input: {
  email: string;
  password: string;
}): ValidationResult => {
  const emailCheck = validateEmail(input.email);
  if (!emailCheck.valid) {
    return emailCheck;
  }
  if (!input.password) {
    return { valid: false, error: 'Password is required.' };
  }
  return { valid: true };
};
