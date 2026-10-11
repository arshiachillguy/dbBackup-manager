import { useEffect, useMemo, useRef, useState } from 'react'
import { StatusBadge } from '../../components/StatusBadge'
import { listBackups } from '../../api/backupApi'
import { ApiError } from '../../api/client'
import { formatBytes, formatDateTime } from '../../lib/format'
import { getInitials } from '../../lib/name'
import { usePreferences } from '../../lib/preferences'
import { DeleteBackupDialog } from '../delete/DeleteBackupDialog'
import { RowActionsMenu } from '../history/RowActionsMenu'
import { RestoreBackupDialog } from '../restore/RestoreBackupDialog'
import { summarizeBackups } from './summary'
import type { BackupRecord } from '../../types/backup'
import './Dashboard.css'

interface DashboardProps {
  username: string
  onSignOut: () => void
  onCreateBackup: () => void
  onViewHistory: () => void
  onViewProfile: () => void
  onViewSettings: () => void
}

type LoadState = 'loading' | 'ready' | 'error'

const RECENT_LIMIT = 10

const RESTORE_DISABLED_REASON =
  'Only completed backups with an available backup file can be restored.'

function isRestorable(backup: BackupRecord): boolean {
  return (
    backup.status === 'COMPLETED' &&
    typeof backup.path === 'string' &&
    backup.path.trim() !== ''
  )
}

function toTimestamp(value: string | null | undefined): number {
  if (!value) {
    return Number.NEGATIVE_INFINITY
  }
  const time = Date.parse(value)
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time
}

export function Dashboard({
  username,
  onSignOut,
  onCreateBackup,
  onViewHistory,
  onViewProfile,
  onViewSettings,
}: DashboardProps) {
  const { timeFormat } = usePreferences()
  const [menuOpen, setMenuOpen] = useState(false)
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<BackupRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BackupRecord | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const detailsCloseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoadState('loading')
      try {
        const data = await listBackups()
        if (!active) {
          return
        }
        setBackups(data)
        setLoadState('ready')
      } catch (error) {
        if (!active) {
          return
        }
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : 'Unable to load recent backups. Please try again.',
        )
        setLoadState('error')
      }
    }

    load()
    return () => {
      active = false
    }
  }, [reloadKey])

  const recentBackups = useMemo(
    () =>
      [...backups]
        .sort(
          (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt),
        )
        .slice(0, RECENT_LIMIT),
    [backups],
  )

  const summary = summarizeBackups(backups)

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

  useEffect(() => {
    if (!selectedBackup) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedBackup(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    detailsCloseRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedBackup])

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
          {loadState === 'loading' ? (
            <div className="dashboard__state" role="status">
              <p className="dashboard__state-title">Loading recent backups…</p>
              <p className="dashboard__state-text">
                Fetching your latest backups.
              </p>
            </div>
          ) : loadState === 'error' ? (
            <div className="dashboard__state" role="alert">
              <p className="dashboard__state-title dashboard__state-title--error">
                Could not load recent backups
              </p>
              <p className="dashboard__state-text">{errorMessage}</p>
              <button
                type="button"
                className="dashboard__state-retry"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                Try again
              </button>
            </div>
          ) : recentBackups.length === 0 ? (
            <div className="dashboard__state">
              <p className="dashboard__state-title">No backups yet</p>
              <p className="dashboard__state-text">
                Your database backups will appear here once they are created.
              </p>
            </div>
          ) : (
            <div className="dashboard__table-wrap">
              <table className="backup-table">
                <thead>
                  <tr>
                    <th scope="col">Backup Name</th>
                    <th scope="col">Database</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Size</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBackups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="backup-table__name">
                        {backup.backupName}
                      </td>
                      <td className="backup-table__database">
                        {backup.dbname}
                      </td>
                      <td>{formatDateTime(backup.createdAt, timeFormat)}</td>
                      <td>
                        {backup.size === null
                          ? '—'
                          : formatBytes(backup.size)}
                      </td>
                      <td>
                        <StatusBadge status={backup.status} />
                      </td>
                      <td>
                        <RowActionsMenu
                          label={`Actions for ${backup.backupName}`}
                          actions={[
                            {
                              key: 'details',
                              label: 'View Details',
                              onSelect: () => setSelectedBackup(backup),
                            },
                            {
                              key: 'restore',
                              label: 'Restore',
                              disabled: !isRestorable(backup),
                              title: isRestorable(backup)
                                ? undefined
                                : RESTORE_DISABLED_REASON,
                              onSelect: () => setRestoreTarget(backup),
                            },
                            {
                              key: 'delete',
                              label: 'Delete',
                              onSelect: () => setDeleteTarget(backup),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {selectedBackup && (
        <>
          <div
            className="dashboard__overlay"
            onClick={() => setSelectedBackup(null)}
            aria-hidden="true"
          />
          <aside
            className="dashboard__details"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-details-title"
          >
            <div className="dashboard__details-head">
              <h2
                className="dashboard__details-title"
                id="dashboard-details-title"
              >
                Backup details
              </h2>
              <button
                type="button"
                ref={detailsCloseRef}
                className="dashboard__details-close"
                aria-label="Close backup details"
                onClick={() => setSelectedBackup(null)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <dl className="dashboard__details-list">
              <div>
                <dt>Backup Name</dt>
                <dd>{selectedBackup.backupName}</dd>
              </div>
              <div>
                <dt>Database Name</dt>
                <dd>{selectedBackup.dbname}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={selectedBackup.status} />
                </dd>
              </div>
              <div>
                <dt>Creation Date</dt>
                <dd>{formatDateTime(selectedBackup.createdAt, timeFormat)}</dd>
              </div>
              <div>
                <dt>Last Updated</dt>
                <dd>
                  {selectedBackup.updatedAt
                    ? formatDateTime(selectedBackup.updatedAt, timeFormat)
                    : '—'}
                </dd>
              </div>
              <div>
                <dt>File Size</dt>
                <dd>
                  {selectedBackup.size === null
                    ? '—'
                    : formatBytes(selectedBackup.size)}
                </dd>
              </div>
              <div>
                <dt>File Path</dt>
                <dd className="dashboard__details-path">
                  {selectedBackup.path ?? '—'}
                </dd>
              </div>
            </dl>
          </aside>
        </>
      )}

      {restoreTarget && (
        <RestoreBackupDialog
          backup={restoreTarget}
          onClose={() => setRestoreTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteBackupDialog
          backup={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null)
            setSelectedBackup(null)
            setReloadKey((key) => key + 1)
          }}
        />
      )}
    </div>
  )
}
