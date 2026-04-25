import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { updateProfile } from '../../../lib/api/settings';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const { user, refreshUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (updatedUser) => {
      toast.success('Profile updated successfully');
      reset({ name: updatedUser.name, email: updatedUser.email });
      await refreshUser();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    mutation.mutate(data);
  };


  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-6">
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
        <p className="text-sm text-text-secondary mt-1">Update your personal information.</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-primary-light flex items-center justify-center text-primary text-xl font-semibold overflow-hidden">
          {user?.avatarUrl ? (
             <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
             user?.name?.charAt(0).toUpperCase() || 'U'
          )}
        </div>
        <div>
          <Button variant="ghost" size="sm" className="mb-1">
            <Upload className="h-4 w-4 mr-2" />
            Change photo
          </Button>
          <p className="text-xs text-text-muted px-2">PNG or JPG, max 2MB</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={mutation.isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
