import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Zap, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils/cn'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const { register: registerAuth } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const passwordValue = watch('password') || ''

  // Calculate password strength
  let strength = 0
  if (passwordValue.length >= 8) strength += 1
  if (/[0-9]/.test(passwordValue)) strength += 1
  if (/[^a-zA-Z0-9]/.test(passwordValue)) strength += 1
  if (/[A-Z]/.test(passwordValue)) strength += 1

  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-border', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setGlobalError('')
      await registerAuth(data.name, data.email, data.password)
      toast.success('Account created successfully!')
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      const message = err.response?.data?.message || 'Something went wrong'
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
          <h1 className="text-2xl font-semibold text-text-primary">Create account</h1>
          <p className="text-sm text-text-secondary mt-1 mb-8">
            Get started with Shortify today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
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
            
            {passwordValue.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 w-full">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'flex-1 rounded-full transition-colors',
                        strength >= level ? strengthColors[strength] : 'bg-border'
                      )}
                    />
                  ))}
                </div>
                <p className={cn('text-xs mt-1 font-medium', `text-${strengthColors[strength].replace('bg-', '')}`)}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {globalError && (
            <div className="bg-danger-bg border border-red-200 rounded-lg px-4 py-3 text-sm text-danger-text mt-4">
              {globalError}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            className="mt-6"
          >
            Create account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:text-primary-hover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
