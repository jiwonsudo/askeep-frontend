export interface SignupRequest {
  email: string
  password: string
  name: string
  department: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserResponse {
  userId: number
  email: string
  name: string
  /** 학과가 생기기 전에 가입한 계정은 null */
  department: string | null
  role: string
  /** `2026-11-20T14:00:00+09:00`처럼 시간대가 붙어서 온다 */
  createdAt: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: UserResponse
}

/** 보낸 필드만 바뀐다 */
export interface UpdateProfileRequest {
  name?: string
  department?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface WithdrawRequest {
  password: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  email: string
  /** 메일로 받은 6자리 숫자 */
  code: string
  newPassword: string
}
