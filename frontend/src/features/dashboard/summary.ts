import type { Backup, BackupSummary } from '../../types/backup'

export function summarizeBackups(records: Backup[]): BackupSummary {
  return records.reduce<BackupSummary>(
    (summary, record) => {
      summary.total += 1
      if (record.status === 'COMPLETED') {
        summary.completed += 1
      } else if (record.status === 'FAILED') {
        summary.failed += 1
      }
      return summary
    },
    { total: 0, completed: 0, failed: 0 },
  )
}
