export const PASSWORD_MIN_LENGTH = 15
export const PASSWORD_MAX_LENGTH = 150

export type FieldErrors<T extends string> = Partial<Record<T, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface LoginFields {
  username: string
  password: string
}

export interface RegisterFields extends LoginFields {
  email: string
  confirmPassword: string
}

export interface ProfileFields {
  fullName: string
  email: string
}

export function validateProfile(
  fields: ProfileFields,
): FieldErrors<keyof ProfileFields> {
  const errors: FieldErrors<keyof ProfileFields> = {}

  if (!fields.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export function validateLogin(
  fields: LoginFields,
): FieldErrors<keyof LoginFields> {
  const errors: FieldErrors<keyof LoginFields> = {}

  if (!fields.username.trim()) {
    errors.username = 'Username is required.'
  }

  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  }

  return errors
}

export function validateRegister(
  fields: RegisterFields,
): FieldErrors<keyof RegisterFields> {
  const errors: FieldErrors<keyof RegisterFields> = {}

  if (!fields.username.trim()) {
    errors.username = 'Username is required.'
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  } else if (fields.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

export function hasErrors<T extends string>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0
}
