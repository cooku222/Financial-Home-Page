import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { Account } from '@/types'

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => apiClient.getAccounts(),
    select: (response) => response.data,
  })
}

export const useAccount = (accountId: string) => {
  return useQuery({
    queryKey: ['accounts', accountId],
    queryFn: () => apiClient.getAccount(accountId),
    select: (response) => response.data,
    enabled: !!accountId,
  })
}
