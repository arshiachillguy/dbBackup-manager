import { useEffect, useMemo, useRef, useState } from 'react'
import { SelectField } from '../../components/SelectField'
import type { SelectOption } from '../../components/SelectField'
import { StatusBadge } from '../../components/StatusBadge'
import { TextField } from '../../components/TextField'
import { RestoreBackupDialog } from '../restore/RestoreBackupDialog'
import { DeleteBackupDialog } from '../delete/DeleteBackupDialog'
import { RowActionsMenu } from './RowActionsMenu'
import { listBackups } from '../../api/backupApi'
import { ApiError } from '../../api/client'
import { formatBytes, formatDateTime } from '../../lib/format'
import { usePreferences } from '../../lib/preferences'
import type { BackupRecord, BackupStatus } from '../../types/backup'
import './BackupHistory.css'

interface BackupHistoryPageProps {
  onBack: () => void
  refreshKey?: number
}

type StatusFilter = BackupStatus | 'ALL'
type SortDirection = 'desc' | 'asc'
type LoadState = 'loading' | 'ready' | 'error'

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'CREATING', label: 'Creating' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
]

const SORT_OPTIONS: SelectOption[] = [
  { value: 'desc', label: 'Newest first' },
  { value: 'asc', label: 'Oldest first' },
]

const RESTORE_DISABLED_REASON =
  'Only completed backups with an available backup file can be restored.'

function isRestorable(backup: BackupRecord): boolean {
  return (
    backup.status === 'COMPLETED' &&
    typeof backup.path === 'string' &&
    backup.path.trim() !== ''
  )
}

export function BackupHistoryPage({
  onBack,
  refreshKey = 0,
}: BackupHistoryPageProps) {
  const { timeFormat } = usePreferences()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<BackupRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BackupRecord | null>(null)
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
            : 'Unable to load backup history. Please try again.',
        )
        setLoadState('error')
      }
    }

    load()
    return () => {
      active = false
    }
  }, [reloadKey, refreshKey])

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

  const visibleBackups = useMemo(() => {
    const query = search.trim().toLowerCase()

    return backups
      .filter((backup) => {
        const matchesStatus =
          statusFilter === 'ALL' || backup.status === statusFilter
        const matchesSearch =
          query === '' ||
          backup.backupName.toLowerCase().includes(query) ||
          backup.dbname.toLowerCase().includes(query)
        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        const difference =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        return sortDirection === 'asc' ? difference : -difference
      })
  }, [backups, search, statusFilter, sortDirection])

  return (
    <div className="history">
      <header className="history__header">
        <button type="button" className="history__back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to Dashboard
        </button>
      </header>

      <main className="history__content">
        <div className="history__intro">
          <h1 className="history__title">Backup History</h1>
          <p className="history__subtitle">
            Review your database backups, including status, size, and creation
            time.
          </p>
        </div>

        <div className="history__toolbar">
          <div className="history__toolbar-field history__toolbar-field--search">
            <TextField
              id="history-search"
              label="Search"
              placeholder="Search by backup name or database"
              value={search}
              autoComplete="off"
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="history__toolbar-field">
            <SelectField
              id="history-status"
              label="Status"
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            />
          </div>
          <div className="history__toolbar-field">
            <SelectField
              id="history-sort"
              label="Sort by creation date"
              options={SORT_OPTIONS}
              value={sortDirection}
              onChange={(event) =>
                setSortDirection(event.target.value as SortDirection)
              }
            />
          </div>
        </div>

        <section className="history__panel">
          {loadState === 'loading' ? (
            <div className="history__empty" role="status">
              <p className="history__empty-title">Loading backups…</p>
              <p className="history__empty-text">
                Fetching your backup history.
              </p>
            </div>
          ) : loadState === 'error' ? (
            <div className="history__empty" role="alert">
              <p className="history__empty-title history__empty-title--error">
                Could not load backup history
              </p>
              <p className="history__empty-text">{errorMessage}</p>
              <button
                type="button"
                className="history__retry"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                Try again
              </button>
            </div>
          ) : visibleBackups.length > 0 ? (
            <div className="history__table-wrap">
              <table className="history-table">
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
                  {visibleBackups.map((backup) => (
                    <tr key={backup.id}>
                      <td className="history-table__name">
                        {backup.backupName}
                      </td>
                      <td className="history-table__muted">{backup.dbname}</td>
                      <td>{formatDateTime(backup.createdAt, timeFormat)}</td>
                      <td>
                        {backup.size === null ? '—' : formatBytes(backup.size)}
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
          ) : backups.length === 0 ? (
            <div className="history__empty">
              <p className="history__empty-title">No backups yet</p>
              <p className="history__empty-text">
                Your database backups will appear here once they are created.
              </p>
            </div>
          ) : (
            <div className="history__empty">
              <p className="history__empty-title">No backups match your filters</p>
              <p className="history__empty-text">
                Try adjusting your search or selecting a different status.
              </p>
            </div>
          )}
        </section>
      </main>

      {selectedBackup && (
        <>
          <div
            className="history__overlay"
            onClick={() => setSelectedBackup(null)}
            aria-hidden="true"
          />
          <aside
            className="history__details"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-details-title"
          >
            <div className="history__details-head">
              <h2 className="history__details-title" id="history-details-title">
                Backup details
              </h2>
              <button
                type="button"
                ref={detailsCloseRef}
                className="history__details-close"
                aria-label="Close backup details"
                onClick={() => setSelectedBackup(null)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <dl className="history__details-list">
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
                <dd className="history__details-path">
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
            setReloadKey((key) => key + 1)
          }}
        />
      )}
    </div>
  )
}
