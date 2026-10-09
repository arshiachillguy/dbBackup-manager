import type { Backup, BackupOwner } from '../../types/backup'

const GIGABYTE = 1024 ** 3
const MEGABYTE = 1024 ** 2

const OWNER: BackupOwner = {
  id: 1,
  username: 'admin',
  email: 'admin@backupmanager.local',
}

export const mockBackups: Backup[] = [
  {
    id: 1,
    backupName: 'Production Nightly',
    size: Math.round(4.82 * GIGABYTE),
    dbname: 'production',
    path: '/backups/production/2026-10-08.sql',
    status: 'COMPLETED',
    createdAt: '2026-10-08T02:00:00',
    updatedAt: '2026-10-08T02:12:00',
    owner: OWNER,
  },
  {
    id: 2,
    backupName: 'Orders Service',
    size: Math.round(1.24 * GIGABYTE),
    dbname: 'orders_prod',
    path: '/backups/orders_prod/2026-10-08.sql',
    status: 'COMPLETED',
    createdAt: '2026-10-08T03:15:00',
    updatedAt: '2026-10-08T03:26:00',
    owner: OWNER,
  },
  {
    id: 3,
    backupName: 'Analytics Warehouse',
    size: Math.round(8.51 * GIGABYTE),
    dbname: 'analytics',
    path: '/backups/analytics/2026-10-08.sql',
    status: 'COMPLETED',
    createdAt: '2026-10-08T04:30:00',
    updatedAt: '2026-10-08T04:47:00',
    owner: OWNER,
  },
  {
    id: 4,
    backupName: 'User Accounts Snapshot',
    size: Math.round(642 * MEGABYTE),
    dbname: 'users_prod',
    path: '/backups/users_prod/2026-10-07.sql',
    status: 'FAILED',
    createdAt: '2026-10-07T23:00:00',
    updatedAt: '2026-10-07T23:04:00',
    owner: OWNER,
  },
  {
    id: 5,
    backupName: 'Billing Service',
    size: Math.round(317 * MEGABYTE),
    dbname: 'billing_prod',
    path: '/backups/billing_prod/2026-10-07.sql',
    status: 'COMPLETED',
    createdAt: '2026-10-07T22:15:00',
    updatedAt: '2026-10-07T22:24:00',
    owner: OWNER,
  },
  {
    id: 6,
    backupName: 'Inventory Database',
    size: Math.round(903 * MEGABYTE),
    dbname: 'inventory',
    path: '/backups/inventory/2026-10-07.sql',
    status: 'FAILED',
    createdAt: '2026-10-07T21:45:00',
    updatedAt: '2026-10-07T21:49:00',
    owner: OWNER,
  },
]
