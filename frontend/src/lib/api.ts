import { 
  User, 
  Account, 
  Transaction, 
  TransferRequest, 
  TransferResponse, 
  Notification, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  ApiResponse,
  PaginatedResponse 
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    }
  }

  // 인증 관련
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.accessToken) {
      this.setToken(response.accessToken)
    }
    
    return response
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    if (response.accessToken) {
      this.setToken(response.accessToken)
    }
    
    return response
  }

  async verify2FA(code: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/auth/2fa', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  async logout(): Promise<void> {
    this.setToken(null)
  }

  // 계좌 관련
  async getAccounts(): Promise<ApiResponse<Account[]>> {
    return this.request<ApiResponse<Account[]>>('/api/accounts')
  }

  async getAccount(accountId: string): Promise<ApiResponse<Account>> {
    return this.request<ApiResponse<Account>>(`/api/accounts/${accountId}`)
  }

  // 거래 내역
  async getTransactions(params: {
    page?: number
    limit?: number
    accountId?: string
  } = {}): Promise<PaginatedResponse<Transaction>> {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.accountId) searchParams.set('accountId', params.accountId)
    
    const queryString = searchParams.toString()
    const endpoint = queryString ? `/api/transactions?${queryString}` : '/api/transactions'
    
    return this.request<PaginatedResponse<Transaction>>(endpoint)
  }

  // 송금
  async transfer(transferData: TransferRequest): Promise<TransferResponse> {
    return this.request<TransferResponse>('/api/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    })
  }

  // 알림
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request<ApiResponse<Notification[]>>('/api/notifications')
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.request<ApiResponse<Notification>>(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    })
  }

  // 사용자 정보
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/user/profile')
  }

  // 헬스 체크
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request<{ status: string; message: string; timestamp: string }>('/api/health')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
