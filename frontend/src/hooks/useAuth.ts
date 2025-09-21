import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth'
import { apiClient } from '@/lib/api'
import { LoginRequest, RegisterRequest, User } from '@/types'

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, setLoading } = useAuthStore()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (response) => {
      login(response.user)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
    onSuccess: (response) => {
      login(response.user)
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })

  const verify2FAMutation = useMutation({
    mutationFn: (code: string) => apiClient.verify2FA(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.error('2FA verification failed:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
  })

  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.getUserProfile(),
    enabled: isAuthenticated,
    select: (response) => response.data,
  })

  return {
    user: userProfile || user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending || isProfileLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verify2FA: verify2FAMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    verify2FAError: verify2FAMutation.error,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isVerify2FAPending: verify2FAMutation.isPending,
  }
}
