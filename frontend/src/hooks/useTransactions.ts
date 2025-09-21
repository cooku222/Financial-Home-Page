import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { Transaction } from '@/types'

interface UseTransactionsParams {
  page?: number
  limit?: number
  accountId?: string
}

export const useTransactions = (params: UseTransactionsParams = {}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiClient.getTransactions(params),
    select: (response) => response,
  })
}
