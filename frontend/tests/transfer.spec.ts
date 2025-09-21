import { test, expect } from '@playwright/test'

test.describe('Transfer Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/')
    await page.fill('input[type="email"]', 'toss@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should complete transfer flow successfully', async ({ page }) => {
    // Open transfer modal
    await page.click('text=송금')
    
    // Fill transfer form
    await page.selectOption('select', '1') // Select first account
    await page.fill('input[placeholder="받는 분 계좌번호"]', '9876543210987654')
    await page.fill('input[placeholder="받는 분 성함"]', '이은행')
    await page.fill('input[placeholder="송금 금액"]', '50000')
    await page.fill('input[placeholder="메모 (선택사항)"]', '테스트 송금')
    
    // Click next button
    await page.click('text=다음')
    
    // Confirm transfer
    await expect(page.locator('text=송금 정보 확인')).toBeVisible()
    await expect(page.locator('text=이은행')).toBeVisible()
    await expect(page.locator('text=50,000원')).toBeVisible()
    
    // Complete transfer
    await page.click('text=송금하기')
    
    // Should show success message
    await expect(page.locator('text=송금 완료!')).toBeVisible()
    await expect(page.locator('text=이은행님에게 50,000원이 송금되었습니다')).toBeVisible()
    
    // Close modal
    await page.click('text=확인')
    
    // Should be back to dashboard
    await expect(page.locator('h2')).toContainText('안녕하세요, 김토스님!')
  })

  test('should prevent duplicate transfer with same idempotency key', async ({ page }) => {
    // Open transfer modal
    await page.click('text=송금')
    
    // Fill transfer form
    await page.selectOption('select', '1')
    await page.fill('input[placeholder="받는 분 계좌번호"]', '9876543210987654')
    await page.fill('input[placeholder="받는 분 성함"]', '이은행')
    await page.fill('input[placeholder="송금 금액"]', '10000')
    
    // Click next button
    await page.click('text=다음')
    
    // Complete first transfer
    await page.click('text=송금하기')
    await expect(page.locator('text=송금 완료!')).toBeVisible()
    await page.click('text=확인')
    
    // Try to make same transfer again immediately
    await page.click('text=송금')
    await page.selectOption('select', '1')
    await page.fill('input[placeholder="받는 분 계좌번호"]', '9876543210987654')
    await page.fill('input[placeholder="받는 분 성함"]', '이은행')
    await page.fill('input[placeholder="송금 금액"]', '10000')
    
    await page.click('text=다음')
    await page.click('text=송금하기')
    
    // Should show error for duplicate transaction
    await expect(page.locator('text=송금 실패')).toBeVisible()
  })

  test('should validate transfer form', async ({ page }) => {
    // Open transfer modal
    await page.click('text=송금')
    
    // Try to submit empty form
    await page.click('text=다음')
    
    // Should show validation errors
    await expect(page.locator('text=출금 계좌를 선택해주세요')).toBeVisible()
  })

  test('should show insufficient balance error', async ({ page }) => {
    // Open transfer modal
    await page.click('text=송금')
    
    // Fill form with amount exceeding balance
    await page.selectOption('select', '1')
    await page.fill('input[placeholder="받는 분 계좌번호"]', '9876543210987654')
    await page.fill('input[placeholder="받는 분 성함"]', '이은행')
    await page.fill('input[placeholder="송금 금액"]', '999999999')
    
    // Next button should be disabled
    await expect(page.locator('text=다음')).toBeDisabled()
  })

  test('should allow canceling transfer', async ({ page }) => {
    // Open transfer modal
    await page.click('text=송금')
    
    // Fill some data
    await page.selectOption('select', '1')
    await page.fill('input[placeholder="받는 분 계좌번호"]', '9876543210987654')
    
    // Click cancel
    await page.click('text=취소')
    
    // Modal should be closed
    await expect(page.locator('text=송금하기')).not.toBeVisible()
  })
})
