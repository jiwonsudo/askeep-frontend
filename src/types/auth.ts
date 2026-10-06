export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserResponse {
  userId: number
  email: string
  name: string
  role: string
  /** 서버 기준 한국 시간, 타임존 표기 없음 */
  createdAt: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: UserResponse
}
