import { http, HttpResponse } from 'msw'
import { User, Account, Transaction, TransferRequest, TransferResponse, Notification, LoginRequest, LoginResponse, RegisterRequest } from '@/types'

// Mock 데이터
const mockUsers: User[] = [
  {
    id: '1',
    name: '김토스',
    email: 'toss@example.com',
    phone: '010-1234-5678',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '이은행',
    email: 'bank@example.com',
    phone: '010-9876-5432',
    isVerified: true,
    createdAt: '2024-01-02T00:00:00Z',
  },
]

const mockAccounts: Account[] = [
  {
    id: '1',
    accountNumber: '1234567890123456',
    accountName: '김토스',
    bankName: '토스뱅크',
    balance: 1500000,
    isMain: true,
    type: 'checking',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    accountNumber: '9876543210987654',
    accountName: '김토스',
    bankName: '신한은행',
    balance: 500000,
    isMain: false,
    type: 'savings',
    createdAt: '2024-01-02T00:00:00Z',
  },
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'transfer',
    amount: -50000,
    description: '이은행에게 송금',
    fromAccount: '1234567890123456',
    toAccount: '9876543210987654',
    toUser: '이은행',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:30:05Z',
    idempotencyKey: 'txn_1642248600000_abc123',
  },
  {
    id: '2',
    type: 'deposit',
    amount: 100000,
    description: '급여 입금',
    toAccount: '1234567890123456',
    status: 'completed',
    createdAt: '2024-01-14T09:00:00Z',
    completedAt: '2024-01-14T09:00:02Z',
  },
]

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'transfer',
    title: '송금 완료',
    message: '이은행님에게 50,000원이 송금되었습니다.',
    isRead: false,
    createdAt: '2024-01-15T10:30:05Z',
  },
  {
    id: '2',
    type: 'deposit',
    title: '입금 알림',
    message: '계좌에 100,000원이 입금되었습니다.',
    isRead: true,
    createdAt: '2024-01-14T09:00:02Z',
  },
]

// Idempotency key 저장소 (실제로는 서버에서 관리)
const processedTransactions = new Set<string>()

export const handlers = [
  // 인증 관련
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as LoginRequest
    
    // 간단한 인증 로직
    if (body.email === 'toss@example.com' && body.password === 'password123') {
      const user = mockUsers[0]
      const response: LoginResponse = {
        user,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        requiresTwoFactor: false,
      }
      return HttpResponse.json(response)
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as RegisterRequest
    
    // 간단한 유효성 검사
    if (body.password !== body.confirmPassword) {
      return HttpResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }
    
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: body.name,
      email: body.email,
      phone: body.phone,
      isVerified: false,
      createdAt: new Date().toISOString(),
    }
    
    mockUsers.push(newUser)
    
    return HttpResponse.json({
      user: newUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      requiresTwoFactor: false,
    })
  }),

  http.post('/api/auth/2fa', async ({ request }) => {
    const body = await request.json() as { code: string }
    
    // 간단한 2FA 검증 (실제로는 더 복잡한 로직)
    if (body.code === '123456') {
      return HttpResponse.json({ success: true })
    }
    
    return HttpResponse.json(
      { error: 'Invalid 2FA code' },
      { status: 400 }
    )
  }),

  // 계좌 관련
  http.get('/api/accounts', () => {
    return HttpResponse.json({
      data: mockAccounts,
      message: 'Accounts retrieved successfully',
      success: true,
    })
  }),

  http.get('/api/accounts/:id', ({ params }) => {
    const account = mockAccounts.find(acc => acc.id === params.id)
    
    if (!account) {
      return HttpResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      data: account,
      message: 'Account retrieved successfully',
      success: true,
    })
  }),

  // 거래 내역
  http.get('/api/transactions', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const accountId = url.searchParams.get('accountId')
    
    let filteredTransactions = mockTransactions
    
    if (accountId) {
      filteredTransactions = mockTransactions.filter(
        txn => txn.fromAccount === accountId || txn.toAccount === accountId
      )
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)
    
    return HttpResponse.json({
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit),
      },
      message: 'Transactions retrieved successfully',
      success: true,
    })
  }),

  // 송금
  http.post('/api/transfer', async ({ request }) => {
    const body = await request.json() as TransferRequest
    
    // Idempotency key 검증
    if (processedTransactions.has(body.idempotencyKey)) {
      return HttpResponse.json(
        { error: 'Duplicate transaction request' },
        { status: 409 }
      )
    }
    
    // 간단한 유효성 검사
    const fromAccount = mockAccounts.find(acc => acc.id === body.fromAccountId)
    if (!fromAccount) {
      return HttpResponse.json(
        { error: 'From account not found' },
        { status: 404 }
      )
    }
    
    if (fromAccount.balance < body.amount) {
      return HttpResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }
    
    // 거래 처리
    processedTransactions.add(body.idempotencyKey)
    
    const newTransaction: Transaction = {
      id: String(mockTransactions.length + 1),
      type: 'transfer',
      amount: -body.amount,
      description: body.description,
      fromAccount: fromAccount.accountNumber,
      toAccount: body.toAccountNumber,
      toUser: body.toUserName,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      idempotencyKey: body.idempotencyKey,
    }
    
    mockTransactions.unshift(newTransaction)
    
    // 계좌 잔액 업데이트
    fromAccount.balance -= body.amount
    
    const response: TransferResponse = {
      transactionId: newTransaction.id,
      status: 'success',
      message: '송금이 완료되었습니다.',
      idempotencyKey: body.idempotencyKey,
    }
    
    return HttpResponse.json(response)
  }),

  // 알림
  http.get('/api/notifications', () => {
    return HttpResponse.json({
      data: mockNotifications,
      message: 'Notifications retrieved successfully',
      success: true,
    })
  }),

  http.patch('/api/notifications/:id/read', ({ params }) => {
    const notification = mockNotifications.find(notif => notif.id === params.id)
    
    if (!notification) {
      return HttpResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }
    
    notification.isRead = true
    
    return HttpResponse.json({
      data: notification,
      message: 'Notification marked as read',
      success: true,
    })
  }),

  // 사용자 정보
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      data: mockUsers[0],
      message: 'User profile retrieved successfully',
      success: true,
    })
  }),

  // 헬스 체크
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      message: 'Server is running properly',
      timestamp: new Date().toISOString(),
    })
  }),
]
