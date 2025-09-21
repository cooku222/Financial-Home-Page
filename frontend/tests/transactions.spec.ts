import { test, expect } from '@playwright/test'

test.describe('Transactions Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/')
    await page.fill('input[type="email"]', 'toss@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Navigate to transactions page
    await page.click('text=전체 거래내역 보기')
    await expect(page).toHaveURL('/transactions')
  })

  test('should display transactions page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('거래내역')
    await expect(page.locator('select')).toBeVisible() // Account filter
    await expect(page.locator('text=필터')).toBeVisible()
    await expect(page.locator('text=검색')).toBeVisible()
    await expect(page.locator('text=기간')).toBeVisible()
  })

  test('should display transaction list', async ({ page }) => {
    await expect(page.locator('text=이은행에게 송금')).toBeVisible()
    await expect(page.locator('text=급여 입금')).toBeVisible()
  })

  test('should filter transactions by account', async ({ page }) => {
    // Select an account from filter
    await page.selectOption('select', '1')
    
    // Should show filtered transactions
    await expect(page.locator('text=이은행에게 송금')).toBeVisible()
  })

  test('should display transaction details', async ({ page }) => {
    // Check if transaction details are visible
    await expect(page.locator('text=송금')).toBeVisible()
    await expect(page.locator('text=입금')).toBeVisible()
    
    // Check transaction amounts
    await expect(page.locator('text=-50,000원')).toBeVisible()
    await expect(page.locator('text=+100,000원')).toBeVisible()
  })

  test('should show transaction status', async ({ page }) => {
    await expect(page.locator('text=완료')).toBeVisible()
  })

  test('should navigate back to dashboard', async ({ page }) => {
    await page.click('button[aria-label="뒤로가기"]')
    await expect(page).toHaveURL('/dashboard')
  })
})
