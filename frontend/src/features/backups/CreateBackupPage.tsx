import { useState } from 'react'
import type { FormEvent } from 'react'
import { createBackup } from '../../api/backupApi'
import { ApiError } from '../../api/client'
import { PasswordField } from '../../components/PasswordField'
import { SelectField } from '../../components/SelectField'
import type { SelectOption } from '../../components/SelectField'
import { StatusBadge } from '../../components/StatusBadge'
import { TextField } from '../../components/TextField'
import { formatBytes, formatDateTime } from '../../lib/format'
import { useNotifications } from '../../lib/notifications'
import { usePreferences } from '../../lib/preferences'
import type { BackupRecord, CreateBackupRequest } from '../../types/backup'
import {
  DATABASE_TYPES,
  DEFAULT_DATABASE_HOST,
  DEFAULT_DATABASE_PORT,
  DEFAULT_DATABASE_TYPE,
  getDatabaseTypeLabel,
} from './databaseTypes'
import './CreateBackup.css'

interface CreateBackupPageProps {
  onBack: () => void
  onViewHistory: () => void
  onBackupCreated: () => void
}

interface BackupFormValues {
  dbname: string
  host: string
  port: string
  username: string
  password: string
}

type BackupField = keyof BackupFormValues
type BackupFieldErrors = Partial<Record<BackupField, string>>

const DATABASE_TYPE_OPTIONS: SelectOption[] = DATABASE_TYPES.map((type) => ({
  value: type.value,
  label: getDatabaseTypeLabel(type.label, type.available),
  disabled: !type.available,
}))

const UNEXPECTED_ERROR =
  'Unable to create the backup. Please check your connection and try again.'

const FAILED_BACKUP_FALLBACK =
  'The backup could not be completed and the backend did not return a specific reason. The failed record has been saved and will appear in your backup history.'

function resolveCreateErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.message.trim()) {
    return error.message
  }
  return UNEXPECTED_ERROR
}

function validateBackupForm(values: BackupFormValues): BackupFieldErrors {
  const errors: BackupFieldErrors = {}

  if (!values.dbname.trim()) {
    errors.dbname = 'Enter the database name.'
  }

  if (!values.host.trim()) {
    errors.host = 'Enter the database host.'
  }

  const port = Number(values.port)

  if (!values.port.trim()) {
    errors.port = 'Enter the database port.'
  } else if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.port = 'Enter a port between 1 and 65535.'
  }

  if (!values.username.trim()) {
    errors.username = 'Enter the database username.'
  }

  if (!values.password) {
    errors.password = 'Enter the database password.'
  }

  return errors
}

export function CreateBackupPage({
  onBack,
  onViewHistory,
  onBackupCreated,
}: CreateBackupPageProps) {
  const { timeFormat } = usePreferences()
  const { notify } = useNotifications()
  const [databaseType, setDatabaseType] = useState(DEFAULT_DATABASE_TYPE)
  const [form, setForm] = useState<BackupFormValues>({
    dbname: '',
    host: DEFAULT_DATABASE_HOST,
    port: DEFAULT_DATABASE_PORT,
    username: '',
    password: '',
  })
  const [fieldErrors, setFieldErrors] = useState<BackupFieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<BackupRecord | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function updateField(field: BackupField, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  async function handleCreateBackup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const errors = validateBackupForm(form)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setErrorMessage(null)
    setResult(null)
    setIsSubmitting(true)

    const request: CreateBackupRequest = {
      dbname: form.dbname.trim(),
      host: form.host.trim(),
      port: Number(form.port),
      username: form.username.trim(),
      password: form.password,
    }

    try {
      const record = await createBackup(request)
      setResult(record)
      onBackupCreated()

      if (record.status === 'FAILED') {
        notify({
          variant: 'error',
          title: 'Backup failed',
          message: FAILED_BACKUP_FALLBACK,
          kind: 'backup',
        })
      } else if (record.status === 'COMPLETED') {
        notify({
          variant: 'success',
          title: 'Backup completed',
          message: `Backup “${record.backupName}” completed successfully.`,
          kind: 'backup',
        })
      } else {
        notify({
          variant: 'success',
          title: 'Backup submitted',
          message: `Backup “${record.backupName}” is ${record.status.toLowerCase()}.`,
          kind: 'backup',
        })
      }
    } catch (error) {
      const message = resolveCreateErrorMessage(error)
      setErrorMessage(message)
      notify({
        variant: 'error',
        title: 'Backup could not be created',
        message,
        kind: 'backup',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCreateAnother() {
    setResult(null)
    setErrorMessage(null)
    setFieldErrors({})
  }

  return (
    <div className="create-backup">
      <header className="create-backup__header">
        <button
          type="button"
          className="create-backup__back"
          onClick={onBack}
        >
          <span aria-hidden="true">←</span> Back to Dashboard
        </button>
      </header>

      <main className="create-backup__content">
        <div className="create-backup__intro">
          <h1 className="create-backup__title">Create Backup</h1>
          <p className="create-backup__description">
            Enter the PostgreSQL connection details and database name to create
            a backup.
          </p>
        </div>

        <section className="create-backup__card" aria-labelledby="create-backup-title">
          <h2 className="create-backup__card-title" id="create-backup-title">
            Create Backup
          </h2>
          <form className="create-backup__form" onSubmit={handleCreateBackup}>
            <SelectField
              id="database-type"
              label="Database Type"
              value={databaseType}
              options={DATABASE_TYPE_OPTIONS}
              onChange={(event) => setDatabaseType(event.target.value)}
            />
            <TextField
              id="backup-dbname"
              label="Database Name"
              value={form.dbname}
              autoComplete="off"
              error={fieldErrors.dbname}
              onChange={(event) => updateField('dbname', event.target.value)}
            />
            <div className="create-backup__row">
              <TextField
                id="backup-host"
                label="Host"
                value={form.host}
                autoComplete="off"
                error={fieldErrors.host}
                onChange={(event) => updateField('host', event.target.value)}
              />
              <TextField
                id="backup-port"
                label="Port"
                value={form.port}
                inputMode="numeric"
                autoComplete="off"
                error={fieldErrors.port}
                onChange={(event) => updateField('port', event.target.value)}
              />
            </div>
            <TextField
              id="backup-username"
              label="Database Username"
              value={form.username}
              autoComplete="off"
              error={fieldErrors.username}
              onChange={(event) => updateField('username', event.target.value)}
            />
            <PasswordField
              id="backup-password"
              label="Database Password"
              value={form.password}
              autoComplete="off"
              error={fieldErrors.password}
              onChange={(event) => updateField('password', event.target.value)}
            />
            <button
              type="submit"
              className="create-backup__button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating backup…' : 'Create Backup'}
            </button>
          </form>
        </section>

        {errorMessage && (
          <section
            className="create-backup__result create-backup__result--error"
            role="alert"
          >
            <h2 className="create-backup__result-title">
              Backup could not be created
            </h2>
            <p className="create-backup__result-text">{errorMessage}</p>
            <p className="create-backup__result-text">
              Your connection details are kept below so you can correct them
              and try again.
            </p>
          </section>
        )}

        {result && (
          <section
            className={`create-backup__result create-backup__result--${
              result.status === 'COMPLETED'
                ? 'success'
                : result.status === 'FAILED'
                  ? 'error'
                  : 'info'
            }`}
            role="status"
          >
            <h2 className="create-backup__result-title">
              {result.status === 'COMPLETED'
                ? 'Backup created successfully.'
                : result.status === 'FAILED'
                  ? 'Backup failed.'
                  : 'Backup submitted.'}
            </h2>

            {result.status === 'FAILED' && (
              <p className="create-backup__result-text">
                {FAILED_BACKUP_FALLBACK}
              </p>
            )}

            <dl className="create-backup__result-list">
              <div>
                <dt>Backup Name</dt>
                <dd>{result.backupName}</dd>
              </div>
              <div>
                <dt>Database Name</dt>
                <dd>{result.dbname}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={result.status} />
                </dd>
              </div>
              <div>
                <dt>Created At</dt>
                <dd>{formatDateTime(result.createdAt, timeFormat)}</dd>
              </div>
              {result.updatedAt && (
                <div>
                  <dt>Last Updated</dt>
                  <dd>{formatDateTime(result.updatedAt, timeFormat)}</dd>
                </div>
              )}
              {result.size !== null && (
                <div>
                  <dt>File Size</dt>
                  <dd>{formatBytes(result.size)}</dd>
                </div>
              )}
              {result.path && (
                <div>
                  <dt>File Path</dt>
                  <dd className="create-backup__result-path">{result.path}</dd>
                </div>
              )}
            </dl>

            <div className="create-backup__result-actions">
              <button
                type="button"
                className="create-backup__button"
                onClick={onViewHistory}
              >
                View Backup History
              </button>
              <button
                type="button"
                className="create-backup__button create-backup__button--secondary"
                onClick={handleCreateAnother}
              >
                Create Another
              </button>
              <button
                type="button"
                className="create-backup__button create-backup__button--secondary"
                onClick={onBack}
              >
                Back to Dashboard
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
