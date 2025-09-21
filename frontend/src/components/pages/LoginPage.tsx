'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const { login, verify2FA, isLoginPending, isVerify2FAPending, loginError, verify2FAError } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      // 로그인 성공 시 대시보드로 이동
      router.push('/dashboard')
    } catch (error) {
      // 에러는 useAuth 훅에서 처리됨
    }
  }

  const handleTwoFactorSubmit = async () => {
    try {
      await verify2FA(twoFactorCode)
      router.push('/dashboard')
    } catch (error) {
      // 에러는 useAuth 훅에서 처리됨
    }
  }

  if (showTwoFactor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">2단계 인증</CardTitle>
            <CardDescription>
              이메일로 전송된 6자리 인증 코드를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="인증 코드 (예: 123456)"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
            {verify2FAError && (
              <p className="text-sm text-error-600 text-center">
                {verify2FAError.message}
              </p>
            )}
            <Button
              onClick={handleTwoFactorSubmit}
              disabled={isVerify2FAPending || twoFactorCode.length !== 6}
              className="w-full"
              isLoading={isVerify2FAPending}
            >
              인증하기
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowTwoFactor(false)}
              className="w-full"
            >
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">토스 스타일 앱</CardTitle>
          <CardDescription>
            안전하고 편리한 금융 서비스를 경험해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              placeholder="이메일 주소"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
            />
            
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              error={errors.password?.message}
            />

            {loginError && (
              <p className="text-sm text-error-600 text-center">
                {loginError.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoginPending}
              disabled={isLoginPending}
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                회원가입
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center mb-2">테스트 계정</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>이메일: toss@example.com</p>
              <p>비밀번호: password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
