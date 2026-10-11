import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  PreferencesContext,
  applyTheme,
  loadPreferences,
  persistPreferences,
} from './preferences'
import type {
  Preferences,
  PreferencesContextValue,
  ThemeChoice,
  TimeFormat,
} from './preferences'

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences)

  useEffect(() => {
    applyTheme(preferences.theme)
  }, [preferences.theme])

  const update = useCallback((patch: Partial<Preferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...patch }
      persistPreferences(next)
      return next
    })
  }, [])

  const setTheme = useCallback(
    (theme: ThemeChoice) => update({ theme }),
    [update],
  )
  const setTimeFormat = useCallback(
    (timeFormat: TimeFormat) => update({ timeFormat }),
    [update],
  )
  const setBackupNotifications = useCallback(
    (backupNotifications: boolean) => update({ backupNotifications }),
    [update],
  )
  const setFailureNotifications = useCallback(
    (failureNotifications: boolean) => update({ failureNotifications }),
    [update],
  )

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...preferences,
      setTheme,
      setTimeFormat,
      setBackupNotifications,
      setFailureNotifications,
    }),
    [
      preferences,
      setTheme,
      setTimeFormat,
      setBackupNotifications,
      setFailureNotifications,
    ],
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}
