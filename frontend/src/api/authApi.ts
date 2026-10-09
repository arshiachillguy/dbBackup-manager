import { postJson } from './client'
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
