import { useEffect, useRef, useState } from 'react'
import { restoreBackup } from '../../api/backupApi'
import { ApiError } from '../../api/client'
import { StatusBadge } from '../../components/StatusBadge'
import { formatDateTime } from '../../lib/format'
import { useNotifications } from '../../lib/notifications'
import { usePreferences } from '../../lib/preferences'
import type { BackupRecord, RestoreResult } from '../../types/backup'
import './RestoreBackupDialog.css'

interface RestoreBackupDialogProps {
  backup: BackupRecord
  onClose: () => void
}

const UNEXPECTED_ERROR =
  'Unable to restore the backup. Please check your connection and try again.'

export function RestoreBackupDialog({
  backup,
  onClose,
}: RestoreBackupDialogProps) {
  const { timeFormat } = usePreferences()
  const { notify } = useNotifications()
  const [confirmed, setConfirmed] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [result, setResult] = useState<RestoreResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleRestore() {
    if (!confirmed || isRestoring) {
      return
    }

    setErrorMessage(null)
    setIsRestoring(true)

    try {
      const response = await restoreBackup(backup.id)
      setResult(response)
      notify({
        variant: response.success ? 'success' : 'error',
        title: response.success ? 'Restore completed' : 'Restore failed',
        message: response.message,
        kind: 'backup',
      })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : UNEXPECTED_ERROR
      setErrorMessage(message)
      notify({
        variant: 'error',
        title: 'Restore failed',
        message,
        kind: 'backup',
      })
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <>
      <div
        className="restore-dialog__overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="restore-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-dialog-title"
      >
        <div className="restore-dialog__head">
          <h2 className="restore-dialog__title" id="restore-dialog-title">
            Restore Backup
          </h2>
          <button
            type="button"
            ref={closeButtonRef}
            className="restore-dialog__close"
            aria-label="Close restore dialog"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {result ? (
          <div
            className={`restore-dialog__result restore-dialog__result--${
              result.success ? 'success' : 'error'
            }`}
            role="status"
          >
            <h3 className="restore-dialog__result-title">
              {result.success ? 'Restore completed.' : 'Restore failed.'}
            </h3>
            <p className="restore-dialog__result-text">{result.message}</p>

            <dl className="restore-dialog__list">
              <div>
                <dt>Backup Name</dt>
                <dd>{result.backupName}</dd>
              </div>
              <div>
                <dt>Database</dt>
                <dd>{result.dbname}</dd>
              </div>
              <div>
                <dt>Restored At</dt>
                <dd>{formatDateTime(result.restoredAt, timeFormat)}</dd>
              </div>
            </dl>

            <div className="restore-dialog__actions">
              <button
                type="button"
                className="restore-dialog__button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="restore-dialog__lead">
              You are about to restore the backup{' '}
              <strong>{backup.backupName}</strong> into the existing database{' '}
              <strong>{backup.dbname}</strong>.
            </p>

            <dl className="restore-dialog__list">
              <div>
                <dt>Backup Name</dt>
                <dd>{backup.backupName}</dd>
              </div>
              <div>
                <dt>Target Database</dt>
                <dd>{backup.dbname}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={backup.status} />
                </dd>
              </div>
              {backup.path && (
                <div>
                  <dt>Backup File</dt>
                  <dd className="restore-dialog__path">{backup.path}</dd>
                </div>
              )}
            </dl>

            <div className="restore-dialog__warning" role="alert">
              <p className="restore-dialog__warning-title">
                This action can destroy data
              </p>
              <p className="restore-dialog__warning-text">
                Restore runs on the backend's PostgreSQL server and affects the
                existing database with the same name shown above on that server.
                It does not restore to your personal computer.
              </p>
              <p className="restore-dialog__warning-text">
                Existing tables and objects in the target database may be
                dropped or replaced. The target database cannot be changed
                through the current endpoint.
              </p>
            </div>

            {errorMessage && (
              <p className="restore-dialog__error" role="alert">
                {errorMessage}
              </p>
            )}

            <label className="restore-dialog__confirm" htmlFor="restore-confirm">
              <input
                id="restore-confirm"
                type="checkbox"
                checked={confirmed}
                disabled={isRestoring}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              <span>
                I understand this may drop or replace existing objects in the
                target database.
              </span>
            </label>

            <div className="restore-dialog__actions">
              <button
                type="button"
                className="restore-dialog__button restore-dialog__button--secondary"
                onClick={onClose}
                disabled={isRestoring}
              >
                Cancel
              </button>
              <button
                type="button"
                className="restore-dialog__button restore-dialog__button--danger"
                onClick={handleRestore}
                disabled={!confirmed || isRestoring}
              >
                {isRestoring ? 'Restoring…' : 'Restore Backup'}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
