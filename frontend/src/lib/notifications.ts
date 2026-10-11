import { createContext, useContext } from 'react'

export type NotificationVariant = 'success' | 'error'

export type NotificationKind = 'backup' | 'system'

export interface NotificationOptions {
  variant: NotificationVariant
  message: string
  title?: string
  kind?: NotificationKind
}

export interface NotificationItem {
  id: number
  variant: NotificationVariant
  title: string
  message: string
}

export interface NotificationsContextValue {
  notify: (options: NotificationOptions) => void
}

export const AUTO_DISMISS_MS = 6000

export const DEFAULT_NOTIFICATION_TITLE: Record<NotificationVariant, string> = {
  success: 'Success',
  error: 'Error',
}

export const NotificationsContext =
  createContext<NotificationsContextValue | null>(null)

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider',
    )
  }
  return context
}
