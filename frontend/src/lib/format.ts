import type { TimeFormat } from './preferences'

const KILOBYTE = 1024
const MEGABYTE = 1024 ** 2
const GIGABYTE = 1024 ** 3

const DATE_TIME_FORMATTERS: Record<TimeFormat, Intl.DateTimeFormat> = {
  '12-hour': new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
  '24-hour': new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }),
}

export function formatDateTime(
  isoDate: string,
  timeFormat: TimeFormat = '24-hour',
): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return DATE_TIME_FORMATTERS[timeFormat].format(date)
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '—'
  }
  if (bytes >= GIGABYTE) {
    return `${(bytes / GIGABYTE).toFixed(2)} GB`
  }
  if (bytes >= MEGABYTE) {
    return `${(bytes / MEGABYTE).toFixed(1)} MB`
  }
  if (bytes >= KILOBYTE) {
    return `${(bytes / KILOBYTE).toFixed(0)} KB`
  }
  return `${bytes} B`
}
