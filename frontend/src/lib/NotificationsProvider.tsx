import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { usePreferences } from './preferences'
import {
  AUTO_DISMISS_MS,
  DEFAULT_NOTIFICATION_TITLE,
  NotificationsContext,
} from './notifications'
import type {
  NotificationItem,
  NotificationOptions,
  NotificationsContextValue,
} from './notifications'
import './notifications.css'

interface ToastProps {
  item: NotificationItem
  onDismiss: (id: number) => void
}

function Toast({ item, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [item.id, onDismiss])

  return (
    <div
      className={`toast toast--${item.variant}`}
      role={item.variant === 'error' ? 'alert' : 'status'}
    >
      <div className="toast__body">
        <p className="toast__title">{item.title}</p>
        <p className="toast__message">{item.message}</p>
      </div>
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(item.id)}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { backupNotifications, failureNotifications } = usePreferences()
  const [items, setItems] = useState<NotificationItem[]>([])
  const nextIdRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const notify = useCallback(
    ({ variant, message, title, kind = 'system' }: NotificationOptions) => {
      if (kind === 'backup') {
        if (variant === 'success' && !backupNotifications) {
          return
        }
        if (variant === 'error' && !failureNotifications) {
          return
        }
      }

      const id = nextIdRef.current
      nextIdRef.current += 1
      setItems((current) => [
        ...current,
        { id, variant, title: title ?? DEFAULT_NOTIFICATION_TITLE[variant], message },
      ])
    },
    [backupNotifications, failureNotifications],
  )

  const value = useMemo<NotificationsContextValue>(() => ({ notify }), [notify])

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-label="Notifications">
        {items.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </NotificationsContext.Provider>
  )
}
