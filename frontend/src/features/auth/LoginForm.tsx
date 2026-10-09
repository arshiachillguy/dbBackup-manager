import { useState } from 'react'
import type { FormEvent } from 'react'
import { login } from '../../api/authApi'
import { ApiError } from '../../api/client'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { PasswordField } from '../../components/PasswordField'
import { TextField } from '../../components/TextField'
import {
  PASSWORD_MIN_LENGTH,
  hasErrors,
  validateLogin,
} from '../../lib/validation'
import type { FieldErrors, LoginFields } from '../../lib/validation'
import type { LoginResponse } from '../../types/auth'

interface LoginFormProps {
  initialUsername?: string
  onSuccess: (session: LoginResponse) => void
}

export function LoginForm({
  initialUsername = '',
  onSuccess,
}: LoginFormProps) {
  const [fields, setFields] = useState<LoginFields>({
    username: initialUsername,
    password: '',
  })
  const [errors, setErrors] = useState<FieldErrors<keyof LoginFields>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function updateField(key: keyof LoginFields, value: string) {
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

    const validationErrors = validateLogin(fields)
    setErrors(validationErrors)
    if (hasErrors(validationErrors)) {
      return
    }

    setLoading(true)
    setApiError(null)
    try {
      const session = await login({
        username: fields.username.trim(),
        password: fields.password,
      })
      onSuccess(session)
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
        id="login-username"
        label="Username"
        value={fields.username}
        autoComplete="username"
        autoFocus
        onChange={(event) => updateField('username', event.target.value)}
        error={errors.username}
      />

      <PasswordField
        id="login-password"
        label="Password"
        value={fields.password}
        autoComplete="current-password"
        onChange={(event) => updateField('password', event.target.value)}
        error={errors.password}
      />

      <p className="auth-form__hint">
        Passwords are at least {PASSWORD_MIN_LENGTH} characters.
      </p>

      <Button type="submit" loading={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
