import { useState } from 'react'
import type { FormEvent } from 'react'
import { TextField } from '../../components/TextField'
import { formatDateTime } from '../../lib/format'
import { getInitials } from '../../lib/name'
import {
  hasErrors,
  validateProfile,
} from '../../lib/validation'
import type { FieldErrors, ProfileFields } from '../../lib/validation'
import './Profile.css'

interface ProfilePageProps {
  id: number
  username: string
  email: string
  onBack: () => void
}

const DEMO_ACCOUNT_CREATED = '2026-01-15T10:30:00'
const DEMO_ACCOUNT_STATUS = 'Active'

function deriveFullName(username: string): string {
  if (!username) {
    return 'Demo User'
  }
  return username.charAt(0).toUpperCase() + username.slice(1)
}

export function ProfilePage({
  id,
  username,
  email: initialEmail,
  onBack,
}: ProfilePageProps) {
  const [fullName, setFullName] = useState(() => deriveFullName(username))
  const [email, setEmail] = useState(initialEmail)
  const [isEditing, setIsEditing] = useState(false)
  const [draftFullName, setDraftFullName] = useState('')
  const [draftEmail, setDraftEmail] = useState('')
  const [errors, setErrors] = useState<FieldErrors<keyof ProfileFields>>({})
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  function startEditing() {
    setDraftFullName(fullName)
    setDraftEmail(email)
    setErrors({})
    setSaveMessage(null)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setErrors({})
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateProfile({
      fullName: draftFullName,
      email: draftEmail,
    })
    setErrors(validation)
    if (hasErrors(validation)) {
      return
    }

    setFullName(draftFullName.trim())
    setEmail(draftEmail.trim())
    setIsEditing(false)
    setSaveMessage('Demo only — changes have not been saved to the server.')
  }

  return (
    <div className="profile">
      <header className="profile__header">
        <button type="button" className="profile__back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to Dashboard
        </button>
      </header>

      <main className="profile__content">
        <div className="profile__intro">
          <h1 className="profile__title">My Profile</h1>
          <p className="profile__subtitle">
            Review your account information and how it appears in Backup
            Manager.
          </p>
        </div>

        <section className="profile__identity" aria-label="Account overview">
          <span className="profile__avatar" aria-hidden="true">
            {getInitials(fullName)}
          </span>
          <div className="profile__identity-info">
            <p className="profile__identity-name">{fullName}</p>
            <p className="profile__identity-username">@{username}</p>
          </div>
        </section>

        <section className="profile__card" aria-labelledby="profile-info-title">
          <div className="profile__card-head">
            <h2 className="profile__card-title" id="profile-info-title">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                type="button"
                className="profile__button"
                onClick={startEditing}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form className="profile__form" onSubmit={handleSave} noValidate>
              <TextField
                id="profile-fullname"
                label="Full Name"
                value={draftFullName}
                autoComplete="name"
                onChange={(event) => setDraftFullName(event.target.value)}
                error={errors.fullName}
              />
              <TextField
                id="profile-email"
                label="Email Address"
                type="email"
                value={draftEmail}
                autoComplete="email"
                onChange={(event) => setDraftEmail(event.target.value)}
                error={errors.email}
              />
              <div className="profile__form-actions">
                <button type="submit" className="profile__button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="profile__button profile__button--secondary"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="profile__list">
              <div>
                <dt>Full Name</dt>
                <dd>{fullName}</dd>
              </div>
              <div>
                <dt>Username</dt>
                <dd>{username}</dd>
              </div>
              <div>
                <dt>Email Address</dt>
                <dd>{email}</dd>
              </div>
            </dl>
          )}

          {saveMessage && (
            <p className="profile__notice" role="status">
              {saveMessage}
            </p>
          )}
        </section>

        <section className="profile__card" aria-labelledby="account-details-title">
          <h2 className="profile__card-title" id="account-details-title">
            Account Details
          </h2>
          <dl className="profile__list">
            <div>
              <dt>Account ID</dt>
              <dd>#{id}</dd>
            </div>
            <div>
              <dt>Account Created</dt>
              <dd>{formatDateTime(DEMO_ACCOUNT_CREATED)}</dd>
            </div>
            <div>
              <dt>Account Status</dt>
              <dd>
                <span className="profile__status">{DEMO_ACCOUNT_STATUS}</span>
              </dd>
            </div>
          </dl>
          <p className="profile__card-note">
            Demo data — these values are illustrative and are not loaded from
            the server.
          </p>
        </section>

        <section className="profile__card" aria-labelledby="security-title">
          <h2 className="profile__card-title" id="security-title">
            Security
          </h2>
          <div className="profile__security-row">
            <div>
              <p className="profile__security-label">Password</p>
              <p className="profile__security-text">
                Updating your password is not available in this demo.
              </p>
            </div>
            <div className="profile__security-actions">
              <span className="profile__coming-soon">Coming Soon</span>
              <button
                type="button"
                className="profile__button profile__button--secondary"
                disabled
              >
                Change Password
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
