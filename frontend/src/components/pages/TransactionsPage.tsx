'use client'

import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatAccountNumber } from '@/lib/utils'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeft,
  Filter,
  Search,
  Calendar
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const router = useRouter()
  
  const { data: accounts } = useAccounts()
  const { data: transactionsData, isLoading } = useTransactions({
    page,
    limit: 20,
    accountId: selectedAccountId || undefined,
  })

  const transactions = transactionsData?.data || []
  const pagination = transactionsData?.pagination

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) {
      return <ArrowDownLeft className="h-5 w-5 text-success-600" />
    } else {
      return <ArrowUpRight className="h-5 w-5 text-error-600" />
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'transfer':
        return '송금'
      case 'deposit':
        return '입금'
      case 'withdrawal':
        return '출금'
      case 'payment':
        return '결제'
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-100'
      case 'pending':
        return 'text-warning-600 bg-warning-100'
      case 'failed':
        return 'text-error-600 bg-error-100'
      case 'cancelled':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 mr-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">거래내역</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                value={selectedAccountId}
                onChange={(e) => {
                  setSelectedAccountId(e.target.value)
                  setPage(1)
                }}
                className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">전체 계좌</option>
                {accounts?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} - {formatAccountNumber(account.accountNumber)}
                  </option>
                ))}
              </select>
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
            
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
            
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              기간
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">거래내역이 없습니다</h3>
                <p className="text-gray-600">아직 거래내역이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        transaction.amount > 0 
                          ? 'bg-success-100' 
                          : 'bg-error-100'
                      }`}>
                        {getTransactionIcon(transaction.type, transaction.amount)}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{getTransactionTypeLabel(transaction.type)}</span>
                          <span>•</span>
                          <span>
                            {new Date(transaction.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        
                        {transaction.toUser && (
                          <p className="text-sm text-gray-500 mt-1">
                            {transaction.amount > 0 ? '받는 분' : '보내는 분'}: {transaction.toUser}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-success-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? '완료' :
                         transaction.status === 'pending' ? '진행중' :
                         transaction.status === 'failed' ? '실패' :
                         transaction.status === 'cancelled' ? '취소' : transaction.status}
                      </span>
                    </div>
                  </div>
                  
                  {transaction.fromAccount && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>출금 계좌</span>
                        <span>{formatAccountNumber(transaction.fromAccount)}</span>
                      </div>
                      {transaction.toAccount && (
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>입금 계좌</span>
                          <span>{formatAccountNumber(transaction.toAccount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                이전
              </Button>
              
              {[...Array(pagination.totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
