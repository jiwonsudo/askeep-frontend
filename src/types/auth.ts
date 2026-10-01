export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export interface MeResponse {
  id: number
  email: string
  nickname: string
}
