import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/토스 스타일 금융 앱/)
    await expect(page.locator('h1')).toContainText('토스 스타일 앱')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    // Fill in login form
    await page.fill('input[type="email"]', 'toss@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h2')).toContainText('안녕하세요, 김토스님!')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=회원가입')
    await expect(page).toHaveURL('/register')
    await expect(page.locator('h1')).toContainText('회원가입')
  })

  test('should register new user', async ({ page }) => {
    // Navigate to register page
    await page.click('text=회원가입')
    
    // Fill in registration form
    await page.fill('input[placeholder="이름"]', '홍길동')
    await page.fill('input[type="email"]', 'hong@example.com')
    await page.fill('input[type="tel"]', '010-1234-5678')
    await page.fill('input[type="password"]', 'password123')
    await page.fill('input[placeholder="비밀번호 확인"]', 'password123')
    
    // Click register button
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should show validation errors', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('text=올바른 이메일 주소를 입력해주세요')).toBeVisible()
    await expect(page.locator('text=비밀번호는 최소 6자 이상이어야 합니다')).toBeVisible()
  })
})
