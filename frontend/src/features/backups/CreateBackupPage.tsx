import { useState } from 'react'
import type { FormEvent } from 'react'
import { SelectField } from '../../components/SelectField'
import type { SelectOption } from '../../components/SelectField'
import { TextField } from '../../components/TextField'
import {
  DATABASE_TYPES,
  DEFAULT_DATABASE_TYPE,
  getDatabaseTypeLabel,
} from './databaseTypes'
import './CreateBackup.css'

interface CreateBackupPageProps {
  onBack: () => void
}

const CONNECTION_TEST_NOTICE =
  'Connection testing will be available once the backend endpoint is implemented.'
const CREATE_BACKUP_NOTICE =
  'Actual backup creation will be enabled after backend integration.'

const DATABASE_TYPE_OPTIONS: SelectOption[] = DATABASE_TYPES.map((type) => ({
  value: type.value,
  label: getDatabaseTypeLabel(type.label, type.available),
  disabled: !type.available,
}))

export function CreateBackupPage({ onBack }: CreateBackupPageProps) {
  const [databaseType, setDatabaseType] = useState(DEFAULT_DATABASE_TYPE)
  const [connectionDbname, setConnectionDbname] = useState('')
  const [connectionUsername, setConnectionUsername] = useState('')
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null)
  const [connectionStepDone, setConnectionStepDone] = useState(false)

  const [backupDbname, setBackupDbname] = useState('')
  const [backupNotice, setBackupNotice] = useState<string | null>(null)

  function handleTestConnection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setConnectionNotice(CONNECTION_TEST_NOTICE)
    setConnectionStepDone(true)
  }

  function handleCreateBackup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBackupNotice(CREATE_BACKUP_NOTICE)
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
            Check your database connection details and prepare a PostgreSQL
            database backup.
          </p>
        </div>

        <section className="create-backup__card" aria-labelledby="test-connection-title">
          <h2 className="create-backup__card-title" id="test-connection-title">
            Test Connection
          </h2>
          <form className="create-backup__form" onSubmit={handleTestConnection}>
            <SelectField
              id="database-type"
              label="Database Type"
              value={databaseType}
              options={DATABASE_TYPE_OPTIONS}
              onChange={(event) => setDatabaseType(event.target.value)}
            />
            <TextField
              id="connection-dbname"
              label="Database Name"
              value={connectionDbname}
              autoComplete="off"
              onChange={(event) => setConnectionDbname(event.target.value)}
            />
            <TextField
              id="connection-username"
              label="Database Username"
              value={connectionUsername}
              autoComplete="off"
              onChange={(event) => setConnectionUsername(event.target.value)}
            />
            <button type="submit" className="create-backup__button">
              Test Connection
            </button>
          </form>

          {connectionNotice && (
            <p className="create-backup__notice" role="status">
              {connectionNotice}
            </p>
          )}
        </section>

        <section className="create-backup__card" aria-labelledby="create-backup-title">
          <h2 className="create-backup__card-title" id="create-backup-title">
            Create Backup
          </h2>
          <form className="create-backup__form" onSubmit={handleCreateBackup}>
            <TextField
              id="backup-dbname"
              label="Database Name"
              value={backupDbname}
              autoComplete="off"
              onChange={(event) => setBackupDbname(event.target.value)}
            />
            <button
              type="submit"
              className="create-backup__button"
              disabled={!connectionStepDone}
            >
              Create Backup
            </button>
            {!connectionStepDone && (
              <p className="create-backup__hint">
                Complete the connection step above to enable this button.
              </p>
            )}
          </form>

          {backupNotice && (
            <p className="create-backup__notice" role="status">
              {backupNotice}
            </p>
          )}
        </section>

        <section className="create-backup__preview" aria-labelledby="success-preview-title">
          <p className="create-backup__preview-label">Preview</p>
          <div className="create-backup__success">
            <span className="create-backup__success-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <h2
              className="create-backup__success-title"
              id="success-preview-title"
            >
              Backup created successfully.
            </h2>
            <button
              type="button"
              className="create-backup__button create-backup__button--secondary"
              onClick={onBack}
            >
              Back to Dashboard
            </button>
          </div>
          <p className="create-backup__preview-note">
            This is a preview of the confirmation that will be shown after
            backend integration. No backup has been created.
          </p>
        </section>
      </main>
    </div>
  )
}
