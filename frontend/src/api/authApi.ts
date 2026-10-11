import { deleteRequest, postJson } from './client'
import { loadSession } from '../lib/authStorage'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth'

export function register(payload: RegisterRequest): Promise<RegisterResponse> {
  return postJson<RegisterResponse>('/api/auth/register', payload)
}

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return postJson<LoginResponse>('/api/auth/login', payload)
}

export function deleteAccount(): Promise<void> {
  const session = loadSession()
  return deleteRequest('/api/users/me', { token: session?.token })
}
