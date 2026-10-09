import type { ApiErrorBody } from '../types/auth'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export class ApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

function resolveUrl(path: string): string {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path
}

async function parseError(response: Response): Promise<ApiError> {
  let code: string | undefined
  let message = `Request failed with status ${response.status}.`

  try {
    const body = (await response.json()) as ApiErrorBody
    if (body?.message) {
      message = body.message
    }
    if (body?.error) {
      code = body.error
    }
  } catch {
    // No JSON error body (e.g. framework-level 4xx/5xx); keep the default message.
  }

  return new ApiError(message, response.status, code)
}

export async function postJson<TResponse>(
  path: string,
  payload: unknown,
): Promise<TResponse> {
  let response: Response

  try {
    response = await fetch(resolveUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new ApiError(
      'Unable to reach the server. Check your connection and try again.',
      0,
    )
  }

  if (!response.ok) {
    throw await parseError(response)
  }

  return (await response.json()) as TResponse
}

export function getApiBaseUrl(): string {
  return API_BASE_URL
}
