import { useState } from 'react'
import { SelectField } from '../../components/SelectField'
import { ToggleSwitch } from '../../components/ToggleSwitch'
import './Settings.css'

interface SettingsPageProps {
  onBack: () => void
}

type ThemeChoice = 'dark' | 'light'
type TimeFormat = '12-hour' | '24-hour'

const THEME_OPTIONS = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
]

const TIME_FORMAT_OPTIONS = [
  { value: '12-hour', label: '12-hour (e.g. 02:30 PM)' },
  { value: '24-hour', label: '24-hour (e.g. 14:30)' },
]

const DEMO_PREVIEW_TIME = new Date('2026-01-15T14:30:00')

function formatPreviewTime(timeFormat: TimeFormat): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12-hour',
  }).format(DEMO_PREVIEW_TIME)
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [theme, setTheme] = useState<ThemeChoice>('dark')
  const [backupNotifications, setBackupNotifications] = useState(true)
  const [failureNotifications, setFailureNotifications] = useState(true)
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24-hour')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  function handleSave() {
    setSaveMessage('Demo only — preferences have not been saved to the server.')
  }

  return (
    <div className="settings">
      <header className="settings__header">
        <button type="button" className="settings__back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to Dashboard
        </button>
      </header>

      <main className="settings__content">
        <div className="settings__intro">
          <h1 className="settings__title">Settings</h1>
          <p className="settings__subtitle">
            Manage your application preferences.
          </p>
        </div>

        <section className="settings__card" aria-labelledby="settings-appearance">
          <h2 className="settings__card-title" id="settings-appearance">
            Appearance
          </h2>
          <SelectField
            id="settings-theme"
            label="Theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={(event) => setTheme(event.target.value as ThemeChoice)}
          />
          <p className="settings__card-note">
            Demo only — theme switching is not applied. This app follows your
            system appearance.
          </p>
        </section>

        <section
          className="settings__card"
          aria-labelledby="settings-notifications"
        >
          <h2 className="settings__card-title" id="settings-notifications">
            Notifications
          </h2>
          <div className="settings__group">
            <ToggleSwitch
              id="settings-backup-notifications"
              label="Backup status notifications"
              description="Get notified when a backup completes successfully or fails."
              checked={backupNotifications}
              onChange={setBackupNotifications}
            />
            <ToggleSwitch
              id="settings-failure-notifications"
              label="Failure notifications"
              description="Get an alert when a backup fails."
              checked={failureNotifications}
              onChange={setFailureNotifications}
            />
          </div>
          <p className="settings__card-note">
            Demo only — toggles are not saved and no notifications are sent.
          </p>
        </section>

        <section
          className="settings__card"
          aria-labelledby="settings-preferences"
        >
          <h2 className="settings__card-title" id="settings-preferences">
            Preferences
          </h2>
          <SelectField
            id="settings-time-format"
            label="Date/time display"
            value={timeFormat}
            options={TIME_FORMAT_OPTIONS}
            onChange={(event) => setTimeFormat(event.target.value as TimeFormat)}
          />
          <p className="settings__preview">
            Preview: <span>{formatPreviewTime(timeFormat)}</span>
          </p>
        </section>

        <div className="settings__actions">
          <button type="button" className="settings__save" onClick={handleSave}>
            Save Preferences
          </button>
        </div>

        {saveMessage && (
          <p className="settings__notice" role="status">
            {saveMessage}
          </p>
        )}
      </main>
    </div>
  )
}
