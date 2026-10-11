import { deleteRequest, getJson, postJson } from './client'
import { loadSession } from '../lib/authStorage'
import type {
  BackupRecord,
  CreateBackupRequest,
  RestoreResult,
} from '../types/backup'

export function listBackups(): Promise<BackupRecord[]> {
  const session = loadSession()
  return getJson<BackupRecord[]>('/api/backups', { token: session?.token })
}

export function createBackup(
  payload: CreateBackupRequest,
): Promise<BackupRecord> {
  const session = loadSession()
  return postJson<BackupRecord>('/api/backups', payload, {
    token: session?.token,
  })
}

export function restoreBackup(backupId: number): Promise<RestoreResult> {
  const session = loadSession()
  return postJson<RestoreResult>(
    `/api/backups/${backupId}/restore`,
    undefined,
    { token: session?.token },
  )
}

export function deleteBackup(backupId: number): Promise<void> {
  const session = loadSession()
  return deleteRequest(`/api/backups/${backupId}`, {
    token: session?.token,
  })
}
