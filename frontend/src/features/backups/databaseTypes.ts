export interface DatabaseType {
  value: string
  label: string
  available: boolean
}

export const DATABASE_TYPES: DatabaseType[] = [
  { value: 'postgresql', label: 'PostgreSQL', available: true },
  { value: 'mysql', label: 'MySQL', available: false },
  { value: 'mariadb', label: 'MariaDB', available: false },
  { value: 'mssql', label: 'Microsoft SQL Server', available: false },
  { value: 'oracle', label: 'Oracle Database', available: false },
  { value: 'mongodb', label: 'MongoDB', available: false },
]

export const DEFAULT_DATABASE_TYPE = 'postgresql'

export function getDatabaseTypeLabel(label: string, available: boolean): string {
  return available ? label : `${label} — Coming Soon`
}
