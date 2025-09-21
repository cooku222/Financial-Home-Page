import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(\d{3})(\d{2})(\d{6})/, '$1-$2-$3')
}

export function maskAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(\d{3})(\d{2})(\d{2})(\d{4})/, '$1-$2-$3-****')
}

export function generateIdempotencyKey(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
