import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Zap, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const from = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setGlobalError('')
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password'
      setGlobalError(message)
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary-light p-2 rounded-xl text-primary mb-6">
            <Zap className="h-6 w-6 fill-primary/20" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">Welcome back</h1>
          <p className="text-sm text-text-secondary mt-1 mb-8">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-1">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                showPassword ? (
                  <EyeOff onClick={() => setShowPassword(false)} className="h-4 w-4" />
                ) : (
                  <Eye onClick={() => setShowPassword(true)} className="h-4 w-4" />
                )
              }
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:text-primary-hover font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {globalError && (
            <div className="bg-danger-bg border border-red-200 rounded-lg px-4 py-3 text-sm text-danger-text">
              {globalError}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            className="mt-2"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:text-primary-hover">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
