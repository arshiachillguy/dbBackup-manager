import { useEffect, useRef, useState } from 'react'
import { deleteAccount } from '../../api/authApi'
import { ApiError } from '../../api/client'
import { useNotifications } from '../../lib/notifications'
import './DeleteAccountDialog.css'

interface DeleteAccountDialogProps {
  username: string
  onClose: () => void
  onDeleted: () => void
}

const UNEXPECTED_ERROR =
  'Unable to delete your account. Please check your connection and try again.'

export function DeleteAccountDialog({
  username,
  onClose,
  onDeleted,
}: DeleteAccountDialogProps) {
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
      await deleteAccount()
      notify({
        variant: 'success',
        title: 'Account deleted',
        message: 'Your account has been permanently deleted.',
        kind: 'system',
      })
      onDeleted()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : UNEXPECTED_ERROR
      setErrorMessage(message)
      notify({
        variant: 'error',
        title: 'Account could not be deleted',
        message,
        kind: 'system',
      })
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        className="account-dialog__overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="account-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dialog-title"
      >
        <div className="account-dialog__head">
          <h2 className="account-dialog__title" id="account-dialog-title">
            Delete Account
          </h2>
          <button
            type="button"
            ref={closeButtonRef}
            className="account-dialog__close"
            aria-label="Close delete account dialog"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <p className="account-dialog__lead">
          You are about to permanently delete the account{' '}
          <strong>@{username}</strong>.
        </p>

        <div className="account-dialog__warning" role="alert">
          <p className="account-dialog__warning-title">
            This action cannot be undone
          </p>
          <p className="account-dialog__warning-text">
            Your account credentials will be permanently removed and you will be
            signed out immediately.
          </p>
          <p className="account-dialog__warning-text">
            Your backup records and server-side backup files are not deleted
            automatically. If your account still has backups, the server will
            block deletion until those records are removed.
          </p>
        </div>

        {errorMessage && (
          <p className="account-dialog__error" role="alert">
            {errorMessage}
          </p>
        )}

        <label className="account-dialog__confirm" htmlFor="account-confirm">
          <input
            id="account-confirm"
            type="checkbox"
            checked={confirmed}
            disabled={isDeleting}
            onChange={(event) => setConfirmed(event.target.checked)}
          />
          <span>
            I understand this permanently deletes my account and cannot be
            undone.
          </span>
        </label>

        <div className="account-dialog__actions">
          <button
            type="button"
            className="account-dialog__button account-dialog__button--secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="account-dialog__button account-dialog__button--danger"
            onClick={handleDelete}
            disabled={!confirmed || isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete Account'}
          </button>
        </div>
      </aside>
    </>
  )
}
