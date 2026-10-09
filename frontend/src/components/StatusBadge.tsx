import type { BackupStatus } from '../types/backup'
import './StatusBadge.css'

const STATUS_LABELS: Record<BackupStatus, string> = {
  CREATING: 'Creating',
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
}

interface StatusBadgeProps {
  status: BackupStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
