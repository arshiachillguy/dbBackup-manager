import { Button } from '../../components/Button'
import type { AuthSession } from '../../lib/authStorage'

interface SignedInPanelProps {
  session: AuthSession
  onSignOut: () => void
}

export function SignedInPanel({ session, onSignOut }: SignedInPanelProps) {
  return (
    <div className="auth-panel">
      <div className="auth-panel__header">
        <h1>You&apos;re signed in</h1>
        <p>Authenticated with the backup manager backend.</p>
      </div>

      <dl className="session-details">
        <div>
          <dt>Username</dt>
          <dd>{session.username}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{session.email}</dd>
        </div>
      </dl>

      <Button type="button" onClick={onSignOut}>
        Sign out
      </Button>
    </div>
  )
}
