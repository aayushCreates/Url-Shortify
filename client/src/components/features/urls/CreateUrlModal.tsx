import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link2, Sparkles, Check, X, QrCode, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Toggle } from '../../ui/Toggle';
import { createUrl, updateUrl, checkSlugAvailability } from '../../../lib/api/urls';
import type { ShortUrl } from '../../../types/api';
import { cn } from '../../../lib/utils/cn';

// Normalize a raw URL string to always have a scheme before Zod validates it
function normalizeUrl(val: string): string {
  if (!val) return val;
  // Protocol-relative: //example.com → https://example.com
  if (val.startsWith('//')) return `https:${val}`;
  // No protocol at all: example.com → https://example.com
  if (!/^https?:\/\//i.test(val)) return `https://${val}`;
  return val;
}

const urlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'Please enter a URL')
    .transform(normalizeUrl)
    .pipe(z.string().url('Please enter a valid URL (e.g., https://example.com)')),
  customSlug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, hyphens, and underscores allowed')
    .optional()
    .or(z.literal('')),
  expiresAt: z.string().optional(),
  password: z.string().optional(),
  maxClicks: z.string().optional(),
});

type UrlFormValues = z.infer<typeof urlSchema>;

interface CreateUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ShortUrl;
}

export function CreateUrlModal({ isOpen, onClose, initialData }: CreateUrlModalProps) {
  const isEditing = !!initialData;
  const [tab, setTab] = useState<'simple' | 'advanced'>('simple');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [hasPassword, setHasPassword] = useState(initialData?.hasPassword || false);
  const [createdData, setCreatedData] = useState<{ shortUrl: string, qrCodeUrl?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      originalUrl: initialData?.originalUrl || '',
      customSlug: initialData?.slug || '',
      password: '',
      expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : '',
      maxClicks: initialData?.maxClicks ? String(initialData.maxClicks) : '',
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        originalUrl: initialData.originalUrl,
        customSlug: initialData.slug,
        password: '',
        expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : '',
        maxClicks: initialData.maxClicks ? String(initialData.maxClicks) : '',
      });
      setHasPassword(initialData.hasPassword);
      setTab(initialData.expiresAt || initialData.maxClicks || initialData.hasPassword ? 'advanced' : 'simple');
    } else {
      reset({ originalUrl: '', customSlug: '', password: '', expiresAt: '', maxClicks: '' });
      setHasPassword(false);
      setTab('simple');
    }
  }, [initialData, reset, isOpen]);

  const slug = watch('customSlug');

  useEffect(() => {
    if (!slug) {
      setSlugStatus('idle');
      return;
    }

    setSlugStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await checkSlugAvailability(slug);
        setSlugStatus(res.available ? 'available' : 'taken');
      } catch {
        setSlugStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const createMutation = useMutation({
    mutationFn: createUrl,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['urls', 'list'] });
      
      const domain = typeof window !== 'undefined' ? window.location.origin : 'https://short.ify';
      setCreatedData({
        shortUrl: `${domain}/${data.slug}`,
      });
      toast.success('Link created successfully!');
    },
    onError: () => {
      toast.error('Failed to create link. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateUrl>[1]) => updateUrl(initialData!.slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['urls', 'list'] });
      toast.success('Link updated successfully!');
      onClose();
    },
    onError: () => {
      toast.error('Failed to update link. Please try again.');
    },
  });

  const onSubmit = (data: UrlFormValues) => {
    if (isEditing) {
      updateMutation.mutate({
        originalUrl: data.originalUrl,
        password: hasPassword ? data.password : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        maxClicks: data.maxClicks ? Number(data.maxClicks) : null,
      });
      return;
    }

    if (tab === 'advanced' && slugStatus === 'taken') {
      toast.error('Custom slug is already taken');
      return;
    }

    createMutation.mutate({
      originalUrl: data.originalUrl,
      customSlug: data.customSlug || undefined,
      password: hasPassword ? data.password : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      maxClicks: data.maxClicks ? Number(data.maxClicks) : undefined,
    });
  };

  const handleClose = () => {
    reset();
    setTab('simple');
    setSlugStatus('idle');
    setHasPassword(false);
    setCreatedData(null);
    createMutation.reset();
    updateMutation.reset();
    onClose();
  };

  const copyToClipboard = async () => {
    if (!createdData) return;
    await navigator.clipboard.writeText(createdData.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdData) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Link created!" description="Your short link is ready to share.">
        <div className="flex flex-col items-center py-6 space-y-6">
          <div className="bg-success-bg p-3 rounded-full animate-bounce-slow">
            <Check className="h-8 w-8 text-success" />
          </div>
          
          <div className="w-full relative group">
            <input 
              readOnly 
              value={createdData.shortUrl} 
              className="w-full bg-bg-muted border border-border text-primary font-medium text-center text-lg py-4 rounded-xl pr-12 focus:outline-none"
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg border border-border shadow-sm text-text-secondary hover:text-primary transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="w-48 h-48 bg-white border border-border rounded-xl p-4 flex items-center justify-center shadow-sm">
            <QrCode className="h-20 w-20 text-text-muted" />
            {/* Real QR code image would go here */}
          </div>

          <div className="w-full flex gap-3 pt-4">
            <Button variant="secondary" className="w-full" onClick={handleClose}>
              Close
            </Button>
            <Button className="w-full" onClick={() => {
              setCreatedData(null);
              reset();
            }}>
              Create Another
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit link" : "Create new link"}
      description={isEditing ? "Update your shortened URL's destination or settings." : "Shorten your URL and optionally configure advanced settings."}
    >
      <div className="flex bg-bg-muted p-1 rounded-lg mb-6">
        <button
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors",
            tab === 'simple' ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
          )}
          onClick={() => setTab('simple')}
        >
          Simple
        </button>
        <button
          className={cn(
            "flex-1 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5",
            tab === 'advanced' ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
          )}
          onClick={() => setTab('advanced')}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Advanced
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Original URL"
          placeholder="https://example.com/very/long/url"
          leftIcon={<Link2 className="h-4 w-4" />}
          error={errors.originalUrl?.message}
          {...register('originalUrl', {
            onBlur: (e) => {
              const normalized = normalizeUrl(e.target.value.trim());
              if (normalized !== e.target.value) {
                e.target.value = normalized;
                // Sync react-hook-form's internal value
                register('originalUrl').onChange({ target: e.target, type: 'change' });
              }
            },
          })}
        />

        {tab === 'advanced' && (
          <div className="space-y-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            <div className="relative">
              <Input
                label="Custom Slug (Optional)"
                placeholder="my-custom-link"
                error={errors.customSlug?.message}
                disabled={isEditing}
                {...register('customSlug')}
              />
              {slug && !isEditing && (
                <div className="absolute right-3 top-9 flex items-center">
                  {slugStatus === 'checking' && <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                  {slugStatus === 'available' && <Check className="h-4 w-4 text-success" />}
                  {slugStatus === 'taken' && <X className="h-4 w-4 text-danger" />}
                </div>
              )}
              {slugStatus === 'taken' && <p className="text-xs text-danger mt-1">This slug is already taken.</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                label="Expiration Date"
                error={errors.expiresAt?.message}
                {...register('expiresAt')}
              />
              <Input
                type="number"
                label="Max Clicks"
                placeholder="Unlimited"
                error={errors.maxClicks?.message}
                {...register('maxClicks')}
              />
            </div>

            <div className="border border-border rounded-xl p-4 bg-bg-page space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Password Protection</h4>
                  <p className="text-xs text-text-secondary">Require a password to access this link</p>
                </div>
                <Toggle checked={hasPassword} onChange={(e) => setHasPassword(e.target.checked)} />
              </div>
              
              {hasPassword && (
                <div className="pt-2 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    error={errors.password?.message}
                    {...register('password', { required: hasPassword ? "Password is required" : false })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isEditing ? updateMutation.isPending : createMutation.isPending}>
            {isEditing ? 'Save Changes' : 'Create Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
