import { useState } from 'react'
import { getInitials } from '../../lib/name'
import { DeleteAccountDialog } from './DeleteAccountDialog'
import './Profile.css'

interface ProfilePageProps {
  username: string
  email: string
  onBack: () => void
  onDeleted: () => void
}

export function ProfilePage({
  username,
  email,
  onBack,
  onDeleted,
}: ProfilePageProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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
            Review your account information.
          </p>
        </div>

        <section className="profile__identity" aria-label="Account overview">
          <span className="profile__avatar" aria-hidden="true">
            {getInitials(username)}
          </span>
          <div className="profile__identity-info">
            <p className="profile__identity-name">{username}</p>
            <p className="profile__identity-username">@{username}</p>
          </div>
        </section>

        <section className="profile__card" aria-labelledby="profile-info-title">
          <h2 className="profile__card-title" id="profile-info-title">
            Profile Information
          </h2>
          <dl className="profile__list">
            <div>
              <dt>Username</dt>
              <dd>{username}</dd>
            </div>
            <div>
              <dt>Email Address</dt>
              <dd>{email}</dd>
            </div>
          </dl>
        </section>

        <section
          className="profile__card"
          aria-labelledby="profile-delete-title"
        >
          <div className="profile__card-head">
            <div className="profile__delete-info">
              <h2 className="profile__card-title" id="profile-delete-title">
                Delete Account
              </h2>
              <p className="profile__delete-text">
                Permanently delete your account. This action cannot be undone.
              </p>
            </div>
            <button
              type="button"
              className="profile__delete-button"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete Account
            </button>
          </div>
          <p className="profile__card-note">
            Your backup records and server-side backup files are not deleted
            automatically. If your account still has backups, deletion is
            blocked until those records are removed.
          </p>
        </section>
      </main>

      {isDeleteOpen && (
        <DeleteAccountDialog
          username={username}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={onDeleted}
        />
      )}
    </div>
  )
}
