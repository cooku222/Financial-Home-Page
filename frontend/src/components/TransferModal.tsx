'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransfer } from '@/hooks/useTransfer'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency, formatAccountNumber, generateIdempotencyKey } from '@/lib/utils'
import { Account } from '@/types'
import { CreditCard, User, DollarSign, MessageSquare } from 'lucide-react'

const transferSchema = z.object({
  fromAccountId: z.string().min(1, '출금 계좌를 선택해주세요'),
  toAccountNumber: z.string().min(1, '받는 분 계좌번호를 입력해주세요'),
  toUserName: z.string().min(1, '받는 분 성함을 입력해주세요'),
  amount: z.number().min(1, '송금 금액을 입력해주세요'),
  description: z.string().optional(),
})

type TransferFormData = z.infer<typeof transferSchema>

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  accounts: Account[]
}

export function TransferModal({ isOpen, onClose, accounts }: TransferModalProps) {
  const [step, setStep] = useState<'form' | 'confirm' | 'success' | 'error'>('form')
  const [transferData, setTransferData] = useState<TransferFormData | null>(null)
  const { transfer, isTransferring, transferError, transferSuccess } = useTransfer()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  })

  const watchedAmount = watch('amount')
  const watchedFromAccountId = watch('fromAccountId')

  const selectedAccount = accounts.find(acc => acc.id === watchedFromAccountId)

  const onSubmit = (data: TransferFormData) => {
    setTransferData(data)
    setStep('confirm')
  }

  const handleConfirm = async () => {
    if (!transferData) return

    try {
      const idempotencyKey = generateIdempotencyKey()
      await transfer({
        ...transferData,
        idempotencyKey,
      })
      setStep('success')
    } catch (error) {
      setStep('error')
    }
  }

  const handleClose = () => {
    setStep('form')
    setTransferData(null)
    reset()
    onClose()
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          출금 계좌
        </label>
        <select
          {...register('fromAccountId')}
          className="w-full h-11 px-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">계좌를 선택해주세요</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.bankName} - {formatAccountNumber(account.accountNumber)} ({formatCurrency(account.balance)})
            </option>
          ))}
        </select>
        {errors.fromAccountId && (
          <p className="mt-1 text-sm text-error-600">{errors.fromAccountId.message}</p>
        )}
      </div>

      <Input
        {...register('toAccountNumber')}
        placeholder="받는 분 계좌번호"
        leftIcon={<CreditCard className="h-5 w-5" />}
        error={errors.toAccountNumber?.message}
      />

      <Input
        {...register('toUserName')}
        placeholder="받는 분 성함"
        leftIcon={<User className="h-5 w-5" />}
        error={errors.toUserName?.message}
      />

      <Input
        {...register('amount', { valueAsNumber: true })}
        type="number"
        placeholder="송금 금액"
        leftIcon={<DollarSign className="h-5 w-5" />}
        error={errors.amount?.message}
      />

      <Input
        {...register('description')}
        placeholder="메모 (선택사항)"
        leftIcon={<MessageSquare className="h-5 w-5" />}
        error={errors.description?.message}
      />

      {selectedAccount && watchedAmount && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">송금 후 잔액</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(selectedAccount.balance - watchedAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleClose}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!selectedAccount || (selectedAccount && selectedAccount.balance < (watchedAmount || 0))}
        >
          다음
        </Button>
      </div>
    </form>
  )

  const renderConfirm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">송금 정보 확인</h3>
        <p className="text-sm text-gray-600">송금 정보를 확인해주세요</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">출금 계좌</span>
            <span className="font-medium">
              {selectedAccount?.bankName} {formatAccountNumber(selectedAccount?.accountNumber || '')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">받는 분</span>
            <span className="font-medium">{transferData?.toUserName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">받는 계좌</span>
            <span className="font-medium">{transferData?.toAccountNumber}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">송금 금액</span>
            <span className="font-bold text-lg text-primary-600">
              {formatCurrency(transferData?.amount || 0)}
            </span>
          </div>
          
          {transferData?.description && (
            <div className="flex justify-between">
              <span className="text-gray-600">메모</span>
              <span className="font-medium">{transferData.description}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setStep('form')}
        >
          이전
        </Button>
        <Button
          className="flex-1"
          onClick={handleConfirm}
          isLoading={isTransferring}
          disabled={isTransferring}
        >
          송금하기
        </Button>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">송금 완료!</h3>
        <p className="text-sm text-gray-600">
          {transferData?.toUserName}님에게 {formatCurrency(transferData?.amount || 0)}원이 송금되었습니다.
        </p>
      </div>

      <Button onClick={handleClose} className="w-full">
        확인
      </Button>
    </div>
  )

  const renderError = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">송금 실패</h3>
        <p className="text-sm text-gray-600">
          {transferError?.message || '송금 중 오류가 발생했습니다. 다시 시도해주세요.'}
        </p>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setStep('form')}
        >
          다시 시도
        </Button>
        <Button
          className="flex-1"
          onClick={handleClose}
        >
          닫기
        </Button>
      </div>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'form' ? '송금하기' : undefined}
      size="md"
    >
      {step === 'form' && renderForm()}
      {step === 'confirm' && renderConfirm()}
      {step === 'success' && renderSuccess()}
      {step === 'error' && renderError()}
    </Modal>
  )
}
