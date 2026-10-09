export type BackupStatus = 'CREATING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

export interface BackupOwner {
  id: number
  username: string
  email: string
}

export interface Backup {
  id: number
  backupName: string
  size: number
  dbname: string
  path: string
  status: BackupStatus
  createdAt: string
  updatedAt: string
  owner: BackupOwner
}

export interface BackupSummary {
  total: number
  completed: number
  failed: number
}
