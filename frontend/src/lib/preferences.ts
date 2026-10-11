import { createContext, useContext } from 'react'

export type ThemeChoice = 'dark' | 'light'
export type TimeFormat = '12-hour' | '24-hour'

export interface Preferences {
  theme: ThemeChoice
  timeFormat: TimeFormat
  backupNotifications: boolean
  failureNotifications: boolean
}

export interface PreferencesContextValue extends Preferences {
  setTheme: (theme: ThemeChoice) => void
  setTimeFormat: (format: TimeFormat) => void
  setBackupNotifications: (enabled: boolean) => void
  setFailureNotifications: (enabled: boolean) => void
}

export const PREFERENCES_STORAGE_KEY = 'backup-manager.preferences'

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'dark',
  timeFormat: '24-hour',
  backupNotifications: true,
  failureNotifications: true,
}

export function getSystemTheme(): ThemeChoice {
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }
  return 'light'
}

export function normalizePreferences(value: unknown): Preferences {
  const source =
    value && typeof value === 'object'
      ? (value as Partial<Record<keyof Preferences, unknown>>)
      : {}

  const theme: ThemeChoice =
    source.theme === 'light' || source.theme === 'dark'
      ? source.theme
      : getSystemTheme()
  const timeFormat: TimeFormat =
    source.timeFormat === '12-hour' || source.timeFormat === '24-hour'
      ? source.timeFormat
      : DEFAULT_PREFERENCES.timeFormat

  return {
    theme,
    timeFormat,
    backupNotifications:
      typeof source.backupNotifications === 'boolean'
        ? source.backupNotifications
        : DEFAULT_PREFERENCES.backupNotifications,
    failureNotifications:
      typeof source.failureNotifications === 'boolean'
        ? source.failureNotifications
        : DEFAULT_PREFERENCES.failureNotifications,
  }
}

export function loadPreferences(): Preferences {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_PREFERENCES, theme: getSystemTheme() }
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (!raw) {
      return { ...DEFAULT_PREFERENCES, theme: getSystemTheme() }
    }
    return normalizePreferences(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_PREFERENCES, theme: getSystemTheme() }
  }
}

export function persistPreferences(preferences: Preferences): void {
  try {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    )
  } catch {
    // Storage may be unavailable (private mode); preferences stay in memory.
  }
}

export function applyTheme(theme: ThemeChoice): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(
  null,
)

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
