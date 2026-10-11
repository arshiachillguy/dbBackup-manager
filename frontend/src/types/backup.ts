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

export interface CreateBackupRequest {
  dbname: string
  host: string
  port: number
  username: string
  password: string
}

export interface BackupRecord {
  id: number
  backupName: string
  dbname: string
  path: string | null
  size: number | null
  status: BackupStatus
  createdAt: string
  updatedAt: string | null
}

export interface RestoreResult {
  success: boolean
  message: string
  backupId: number
  backupName: string
  dbname: string
  restoredAt: string
}
