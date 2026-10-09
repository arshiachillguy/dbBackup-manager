import { useState } from 'react'
import type { FormEvent } from 'react'
import { register } from '../../api/authApi'
import { ApiError } from '../../api/client'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { PasswordField } from '../../components/PasswordField'
import { TextField } from '../../components/TextField'
import {
  PASSWORD_MIN_LENGTH,
  hasErrors,
  validateRegister,
} from '../../lib/validation'
import type { FieldErrors, RegisterFields } from '../../lib/validation'

interface RegisterFormProps {
  onRegistered: (username: string) => void
}

const initialFields: RegisterFields = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const [fields, setFields] = useState<RegisterFields>(initialFields)
  const [errors, setErrors] = useState<FieldErrors<keyof RegisterFields>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function updateField(key: keyof RegisterFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setApiError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateRegister(fields)
    setErrors(validationErrors)
    if (hasErrors(validationErrors)) {
      return
    }

    setLoading(true)
    setApiError(null)
    try {
      const response = await register({
        username: fields.username.trim(),
        email: fields.email.trim(),
        password: fields.password,
      })
      onRegistered(response.username)
    } catch (error) {
      setApiError(
        error instanceof ApiError
          ? error.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {apiError && <Alert variant="error">{apiError}</Alert>}

      <TextField
        id="register-username"
        label="Username"
        value={fields.username}
        autoComplete="username"
        autoFocus
        onChange={(event) => updateField('username', event.target.value)}
        error={errors.username}
      />

      <TextField
        id="register-email"
        label="Email"
        type="email"
        value={fields.email}
        autoComplete="email"
        onChange={(event) => updateField('email', event.target.value)}
        error={errors.email}
      />

      <PasswordField
        id="register-password"
        label="Password"
        value={fields.password}
        autoComplete="new-password"
        onChange={(event) => updateField('password', event.target.value)}
        error={errors.password}
      />

      <PasswordField
        id="register-confirm-password"
        label="Confirm password"
        value={fields.confirmPassword}
        autoComplete="new-password"
        onChange={(event) => updateField('confirmPassword', event.target.value)}
        error={errors.confirmPassword}
      />

      <p className="auth-form__hint">
        Passwords must be {PASSWORD_MIN_LENGTH}–150 characters.
      </p>

      <Button type="submit" loading={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
