import { useEffect, useMemo, useRef, useState } from 'react'
import { SelectField } from '../../components/SelectField'
import type { SelectOption } from '../../components/SelectField'
import { StatusBadge } from '../../components/StatusBadge'
import { TextField } from '../../components/TextField'
import { formatBytes, formatDateTime } from '../../lib/format'
import type { Backup, BackupStatus } from '../../types/backup'
import { mockBackupHistory } from './mockBackupHistory'
import './BackupHistory.css'

interface BackupHistoryPageProps {
  onBack: () => void
}

type StatusFilter = BackupStatus | 'ALL'
type SortDirection = 'desc' | 'asc'

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

export function BackupHistoryPage({ onBack }: BackupHistoryPageProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  const detailsCloseRef = useRef<HTMLButtonElement>(null)

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

    return mockBackupHistory
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
  }, [search, statusFilter, sortDirection])

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
          {visibleBackups.length > 0 ? (
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
                      <td>{formatDateTime(backup.createdAt)}</td>
                      <td>{formatBytes(backup.size)}</td>
                      <td>
                        <StatusBadge status={backup.status} />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="history__details-button"
                          onClick={() => setSelectedBackup(backup)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : mockBackupHistory.length === 0 ? (
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
                <dd>{formatDateTime(selectedBackup.createdAt)}</dd>
              </div>
              <div>
                <dt>Last Updated</dt>
                <dd>{formatDateTime(selectedBackup.updatedAt)}</dd>
              </div>
              <div>
                <dt>File Size</dt>
                <dd>{formatBytes(selectedBackup.size)}</dd>
              </div>
              <div>
                <dt>File Path</dt>
                <dd className="history__details-path">
                  {selectedBackup.path}
                </dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{selectedBackup.owner.username}</dd>
              </div>
            </dl>

            <p className="history__details-note">
              This is mock data shown for demonstration. No backend request was
              made.
            </p>
          </aside>
        </>
      )}
    </div>
  )
}
