import { useState } from 'react'
import { Alert } from '../../components/Alert'
import type { LoginResponse } from '../../types/auth'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type Mode = 'login' | 'register'

interface AuthPageProps {
  onAuthenticated: (session: LoginResponse) => void
}

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [registeredUsername, setRegisteredUsername] = useState<string | null>(
    null,
  )
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setSuccessMessage(null)
  }

  function handleRegistered(username: string) {
    setRegisteredUsername(username)
    setSuccessMessage(`Account “${username}” created. Sign in to continue.`)
    setMode('login')
  }

  return (
    <div className="auth-panel">
      <div className="auth-panel__tabs" role="tablist" aria-label="Authentication">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          className="auth-panel__tab"
          onClick={() => switchMode('login')}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'register'}
          className="auth-panel__tab"
          onClick={() => switchMode('register')}
        >
          Create account
        </button>
      </div>

      <div className="auth-panel__header">
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p>
          {mode === 'login'
            ? 'Sign in to access your backup manager.'
            : 'Set up credentials to start managing backups.'}
        </p>
      </div>

      {successMessage && mode === 'login' && (
        <Alert variant="success">{successMessage}</Alert>
      )}

      {mode === 'login' ? (
        <LoginForm
          initialUsername={registeredUsername ?? ''}
          onSuccess={onAuthenticated}
        />
      ) : (
        <RegisterForm onRegistered={handleRegistered} />
      )}
    </div>
  )
}
