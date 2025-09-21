'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

const registerSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  confirmPassword: z.string().min(6, '비밀번호 확인을 입력해주세요'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isRegisterPending, registerError } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data)
      // 회원가입 성공 시 대시보드로 이동
      router.push('/dashboard')
    } catch (error) {
      // 에러는 useAuth 훅에서 처리됨
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">회원가입</CardTitle>
          <CardDescription>
            토스와 함께 시작하는 새로운 금융 경험
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('name')}
              type="text"
              placeholder="이름"
              leftIcon={<User className="h-5 w-5" />}
              error={errors.name?.message}
            />
            
            <Input
              {...register('email')}
              type="email"
              placeholder="이메일 주소"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
            />

            <Input
              {...register('phone')}
              type="tel"
              placeholder="전화번호 (예: 010-1234-5678)"
              leftIcon={<Phone className="h-5 w-5" />}
              error={errors.phone?.message}
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

            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="비밀번호 확인"
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
              error={errors.confirmPassword?.message}
            />

            {registerError && (
              <p className="text-sm text-error-600 text-center">
                {registerError.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isRegisterPending}
              disabled={isRegisterPending}
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => router.push('/')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                로그인
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 text-center mb-2">개인정보 처리방침</p>
            <p className="text-xs text-gray-600 text-center">
              회원가입 시 개인정보 처리방침에 동의한 것으로 간주됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
