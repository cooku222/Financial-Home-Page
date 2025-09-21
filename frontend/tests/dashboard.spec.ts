import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/')
    await page.fill('input[type="email"]', 'toss@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should display dashboard with user information', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('안녕하세요, 김토스님!')
    await expect(page.locator('text=총 자산')).toBeVisible()
    await expect(page.locator('text=내 계좌')).toBeVisible()
    await expect(page.locator('text=최근 거래내역')).toBeVisible()
  })

  test('should display accounts list', async ({ page }) => {
    await expect(page.locator('text=토스뱅크')).toBeVisible()
    await expect(page.locator('text=신한은행')).toBeVisible()
    await expect(page.locator('text=주계좌')).toBeVisible()
  })

  test('should display recent transactions', async ({ page }) => {
    await expect(page.locator('text=이은행에게 송금')).toBeVisible()
    await expect(page.locator('text=급여 입금')).toBeVisible()
  })

  test('should open transfer modal', async ({ page }) => {
    await page.click('text=송금')
    
    // Modal should be visible
    await expect(page.locator('text=송금하기')).toBeVisible()
    await expect(page.locator('select')).toBeVisible()
    await expect(page.locator('input[placeholder="받는 분 계좌번호"]')).toBeVisible()
  })

  test('should navigate to transactions page', async ({ page }) => {
    await page.click('text=전체 거래내역 보기')
    await expect(page).toHaveURL('/transactions')
  })

  test('should logout successfully', async ({ page }) => {
    await page.click('button[aria-label="닫기"]')
    await expect(page).toHaveURL('/')
  })
})
