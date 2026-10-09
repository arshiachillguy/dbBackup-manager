export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  id: number
  username: string
  email: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  email: string
  token: string
}

export interface ApiErrorBody {
  status?: number
  timestamp?: string
  error?: string
  message?: string
}
