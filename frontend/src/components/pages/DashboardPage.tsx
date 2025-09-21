'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatAccountNumber } from '@/lib/utils'
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Bell, 
  Settings, 
  LogOut,
  Plus,
  TrendingUp,
  Wallet
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TransferModal } from '@/components/TransferModal'
import { SkipLink } from '@/components/ui/SkipLink'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const { data: accounts, isLoading: accountsLoading } = useAccounts()
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({ limit: 5 })
  const [showTransferModal, setShowTransferModal] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const mainAccount = accounts?.find(account => account.isMain)
  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0

  if (accountsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Link for Accessibility */}
      <SkipLink href="#main-content">메인 콘텐츠로 건너뛰기</SkipLink>
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">토스</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            안녕하세요, {user?.name}님! 👋
          </h2>
          <p className="text-gray-600">오늘도 좋은 하루 되세요</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 gradient-toss text-white">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/80 text-sm mb-1">총 자산</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => setShowTransferModal(true)}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                송금
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                입금
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">내 계좌</h3>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                계좌 추가
              </Button>
            </div>
            
            <div className="space-y-4">
              {accounts?.map((account) => (
                <Card key={account.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                          <Wallet className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{account.bankName}</h4>
                          <p className="text-sm text-gray-600">
                            {formatAccountNumber(account.accountNumber)}
                          </p>
                          {account.isMain && (
                            <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              주계좌
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(account.balance)}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{account.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">최근 거래내역</h3>
            
            <div className="space-y-4">
              {transactionsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                transactionsData?.data?.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            transaction.amount > 0 
                              ? 'bg-success-100 text-success-600' 
                              : 'bg-error-100 text-error-600'
                          }`}>
                            {transaction.amount > 0 ? (
                              <ArrowDownLeft className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-success-600' : 'text-gray-900'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push('/transactions')}
            >
              전체 거래내역 보기
            </Button>
          </div>
        </div>
      </main>

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          accounts={accounts || []}
        />
      )}
    </div>
  )
}
