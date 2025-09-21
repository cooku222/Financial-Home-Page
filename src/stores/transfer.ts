import { create } from 'zustand'
import { TransferRequest, TransferResponse } from '@/types'

interface TransferState {
  isTransferring: boolean
  transferHistory: TransferResponse[]
  currentTransfer: TransferRequest | null
  setTransferring: (isTransferring: boolean) => void
  setCurrentTransfer: (transfer: TransferRequest | null) => void
  addTransferToHistory: (transfer: TransferResponse) => void
  clearCurrentTransfer: () => void
}

export const useTransferStore = create<TransferState>((set) => ({
  isTransferring: false,
  transferHistory: [],
  currentTransfer: null,
  setTransferring: (isTransferring: boolean) => set({ isTransferring }),
  setCurrentTransfer: (currentTransfer: TransferRequest | null) => set({ currentTransfer }),
  addTransferToHistory: (transfer: TransferResponse) => 
    set((state) => ({ 
      transferHistory: [transfer, ...state.transferHistory] 
    })),
  clearCurrentTransfer: () => set({ currentTransfer: null }),
}))
