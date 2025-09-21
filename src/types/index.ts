export interface User {
  id: string
  name: string
  email: string
  phone: string
  isVerified: boolean
  createdAt: string
}

export interface Account {
  id: string
  accountNumber: string
  accountName: string
  bankName: string
  balance: number
  isMain: boolean
  type: 'checking' | 'savings' | 'investment'
  createdAt: string
}

export interface Transaction {
  id: string
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment'
  amount: number
  description: string
  fromAccount?: string
  toAccount?: string
  toUser?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  completedAt?: string
  idempotencyKey?: string
}

export interface TransferRequest {
  fromAccountId: string
  toAccountNumber: string
  toUserName: string
  amount: number
  description: string
  idempotencyKey: string
}

export interface TransferResponse {
  transactionId: string
  status: 'success' | 'failed'
  message: string
  idempotencyKey: string
}

export interface Notification {
  id: string
  type: 'transfer' | 'deposit' | 'payment' | 'security'
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
  twoFactorCode?: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  requiresTwoFactor: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
