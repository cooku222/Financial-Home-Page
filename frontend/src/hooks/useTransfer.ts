import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useTransferStore } from '@/stores/transfer'
import { TransferRequest, TransferResponse } from '@/types'

export const useTransfer = () => {
  const queryClient = useQueryClient()
  const { setTransferring, addTransferToHistory, clearCurrentTransfer } = useTransferStore()

  const transferMutation = useMutation({
    mutationFn: (transferData: TransferRequest) => apiClient.transfer(transferData),
    onMutate: () => {
      setTransferring(true)
    },
    onSuccess: (response: TransferResponse) => {
      addTransferToHistory(response)
      clearCurrentTransfer()
      
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      console.error('Transfer failed:', error)
    },
    onSettled: () => {
      setTransferring(false)
    },
  })

  return {
    transfer: transferMutation.mutate,
    isTransferring: transferMutation.isPending,
    transferError: transferMutation.error,
    transferSuccess: transferMutation.isSuccess,
  }
}
