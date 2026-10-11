import { useEffect, useRef, useState } from 'react'
import { deleteBackup } from '../../api/backupApi'
import { ApiError } from '../../api/client'
import { StatusBadge } from '../../components/StatusBadge'
import { useNotifications } from '../../lib/notifications'
import type { BackupRecord } from '../../types/backup'
import './DeleteBackupDialog.css'

interface DeleteBackupDialogProps {
  backup: BackupRecord
  onClose: () => void
  onDeleted: () => void
}

const UNEXPECTED_ERROR =
  'Unable to delete the backup. Please check your connection and try again.'

export function DeleteBackupDialog({
  backup,
  onClose,
  onDeleted,
}: DeleteBackupDialogProps) {
  const { notify } = useNotifications()
  const [confirmed, setConfirmed] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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

  async function handleDelete() {
    if (!confirmed || isDeleting) {
      return
    }

    setErrorMessage(null)
    setIsDeleting(true)

    try {
      await deleteBackup(backup.id)
      notify({
        variant: 'success',
        title: 'Backup deleted',
        message: `Backup “${backup.backupName}” was deleted.`,
        kind: 'backup',
      })
      onDeleted()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : UNEXPECTED_ERROR
      setErrorMessage(message)
      notify({
        variant: 'error',
        title: 'Backup could not be deleted',
        message,
        kind: 'backup',
      })
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        className="delete-dialog__overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="delete-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="delete-dialog__head">
          <h2 className="delete-dialog__title" id="delete-dialog-title">
            Delete Backup
          </h2>
          <button
            type="button"
            ref={closeButtonRef}
            className="delete-dialog__close"
            aria-label="Close delete dialog"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <p className="delete-dialog__lead">
          You are about to permanently delete the backup{' '}
          <strong>{backup.backupName}</strong>.
        </p>

        <dl className="delete-dialog__list">
          <div>
            <dt>Backup Name</dt>
            <dd>{backup.backupName}</dd>
          </div>
          <div>
            <dt>Database</dt>
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
              <dd className="delete-dialog__path">{backup.path}</dd>
            </div>
          )}
        </dl>

        <div className="delete-dialog__warning" role="alert">
          <p className="delete-dialog__warning-title">This cannot be undone</p>
          <p className="delete-dialog__warning-text">
            The backup history record will be permanently deleted.
            {backup.path
              ? ' The backup file on the server will also be permanently deleted.'
              : ' This record has no backup file on the server.'}
          </p>
        </div>

        {errorMessage && (
          <p className="delete-dialog__error" role="alert">
            {errorMessage}
          </p>
        )}

        <label className="delete-dialog__confirm" htmlFor="delete-confirm">
          <input
            id="delete-confirm"
            type="checkbox"
            checked={confirmed}
            disabled={isDeleting}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>
            I understand this permanently deletes the record and the server-side
            backup file (if present).
          </span>
        </label>

        <div className="delete-dialog__actions">
          <button
            type="button"
            className="delete-dialog__button delete-dialog__button--secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-dialog__button delete-dialog__button--danger"
            onClick={handleDelete}
            disabled={!confirmed || isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete Backup'}
          </button>
        </div>
      </aside>
    </>
  )
}
