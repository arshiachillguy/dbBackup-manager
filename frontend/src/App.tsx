import { useState } from 'react'
import { AuthPage } from './features/auth/AuthPage'
import { CreateBackupPage } from './features/backups/CreateBackupPage'
import { Dashboard } from './features/dashboard/Dashboard'
import { BackupHistoryPage } from './features/history/BackupHistoryPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { SettingsPage } from './features/settings/SettingsPage'
import {
  clearSession,
  loadSession,
  saveSession,
} from './lib/authStorage'
import type { AuthSession } from './lib/authStorage'
import type { LoginResponse } from './types/auth'
import './App.css'

type AppView =
  | 'dashboard'
  | 'create-backup'
  | 'backup-history'
  | 'profile'
  | 'settings'

function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession())
  const [view, setView] = useState<AppView>('dashboard')

  function handleAuthenticated(response: LoginResponse) {
    const next: AuthSession = {
      id: response.id,
      username: response.username,
      email: response.email,
      token: response.token,
    }
    saveSession(next)
    setSession(next)
    setView('dashboard')
  }

  function handleSignOut() {
    clearSession()
    setSession(null)
    setView('dashboard')
  }

  if (session) {
    if (view === 'create-backup') {
      return <CreateBackupPage onBack={() => setView('dashboard')} />
    }

    if (view === 'backup-history') {
      return <BackupHistoryPage onBack={() => setView('dashboard')} />
    }

    if (view === 'profile') {
      return (
        <ProfilePage
          id={session.id}
          username={session.username}
          email={session.email}
          onBack={() => setView('dashboard')}
        />
      )
    }

    if (view === 'settings') {
      return <SettingsPage onBack={() => setView('dashboard')} />
    }

    return (
      <Dashboard
        username={session.username}
        onSignOut={handleSignOut}
        onCreateBackup={() => setView('create-backup')}
        onViewHistory={() => setView('backup-history')}
        onViewProfile={() => setView('profile')}
        onViewSettings={() => setView('settings')}
      />
    )
  }

  return (
    <main className="app">
      <header className="app__brand">
        <span className="app__logo" aria-hidden="true">
          BM
        </span>
        <div>
          <h2>Backup Manager</h2>
          <p>Secure access to your database backups</p>
        </div>
      </header>

      <AuthPage onAuthenticated={handleAuthenticated} />
    </main>
  )
}

export default App
