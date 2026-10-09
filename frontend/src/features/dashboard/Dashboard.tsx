import { useEffect, useRef, useState } from 'react'
import { StatusBadge } from '../../components/StatusBadge'
import { formatBytes, formatDateTime } from '../../lib/format'
import { getInitials } from '../../lib/name'
import { mockBackups } from './mockBackups'
import { summarizeBackups } from './summary'
import './Dashboard.css'

interface DashboardProps {
  username: string
  onSignOut: () => void
  onCreateBackup: () => void
  onViewHistory: () => void
  onViewProfile: () => void
  onViewSettings: () => void
}

export function Dashboard({
  username,
  onSignOut,
  onCreateBackup,
  onViewHistory,
  onViewProfile,
  onViewSettings,
}: DashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const summary = summarizeBackups(mockBackups)

  const cards = [
    { label: 'Total Backups', value: summary.total, tone: 'neutral' },
    { label: 'Completed Backups', value: summary.completed, tone: 'success' },
    { label: 'Failed Backups', value: summary.failed, tone: 'danger' },
  ] as const

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-left">
          <button
            type="button"
            className="dashboard__hamburger"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="dashboard-nav-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="dashboard__hamburger-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
          <h1 className="dashboard__title">Dashboard</h1>
        </div>

        <div className="dashboard__profile">
          <span className="dashboard__avatar" aria-hidden="true">
            {getInitials(username)}
          </span>
          <span className="dashboard__profile-name">{username}</span>
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="dashboard__overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="dashboard-nav-drawer"
            className="dashboard__drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            <div className="dashboard__drawer-header">
              <div className="dashboard__brand">
                <span className="dashboard__logo" aria-hidden="true">
                  BM
                </span>
                <span className="dashboard__brand-name">Backup Manager</span>
              </div>
              <button
                type="button"
                ref={closeButtonRef}
                className="dashboard__drawer-close"
                aria-label="Close navigation menu"
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <nav className="dashboard__nav" aria-label="Main navigation">
              <a
                className="dashboard__nav-item dashboard__nav-item--active"
                aria-current="page"
              >
                Dashboard
              </a>
              <button
                type="button"
                className="dashboard__nav-item dashboard__nav-item--button"
                onClick={() => {
                  setMenuOpen(false)
                  onViewHistory()
                }}
              >
                Backup History
              </button>
              <button
                type="button"
                className="dashboard__nav-item dashboard__nav-item--button"
                onClick={() => {
                  setMenuOpen(false)
                  onViewProfile()
                }}
              >
                Profile
              </button>
              <button
                type="button"
                className="dashboard__nav-item dashboard__nav-item--button"
                onClick={() => {
                  setMenuOpen(false)
                  onViewSettings()
                }}
              >
                Settings
              </button>
            </nav>

            <button
              type="button"
              className="dashboard__signout"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </aside>
        </>
      )}

      <main className="dashboard__content">
        <section className="dashboard__welcome">
          <h2>Welcome back{username ? `, ${username}` : ''}</h2>
          <p>
            Backup Manager keeps your database backups organized, monitored, and
            easy to review from one place.
          </p>
        </section>

        <section className="dashboard__cards" aria-label="Backup summary">
          {cards.map((card) => (
            <article key={card.label} className="summary-card">
              <p className="summary-card__label">{card.label}</p>
              <p
                className={`summary-card__value summary-card__value--${card.tone}`}
              >
                {card.value}
              </p>
            </article>
          ))}
        </section>

        <section className="dashboard__recent">
          <div className="dashboard__recent-head">
            <h2 className="dashboard__section-title">Recent backups</h2>
            <button
              type="button"
              className="dashboard__create-backup"
              onClick={onCreateBackup}
            >
              Create Backup
            </button>
          </div>
          <div className="dashboard__table-wrap">
            <table className="backup-table">
              <thead>
                <tr>
                  <th scope="col">Backup Name</th>
                  <th scope="col">Database</th>
                  <th scope="col">Created At</th>
                  <th scope="col">Size</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBackups.map((backup) => (
                  <tr key={backup.id}>
                    <td className="backup-table__name">{backup.backupName}</td>
                    <td className="backup-table__database">{backup.dbname}</td>
                    <td>{formatDateTime(backup.createdAt)}</td>
                    <td>{formatBytes(backup.size)}</td>
                      <td>
                        <StatusBadge status={backup.status} />
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
