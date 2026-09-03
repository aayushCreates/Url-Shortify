import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Switch } from '../../ui/Switch';
import { updateNotifications } from '../../../lib/api/settings';

export function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    weeklyDigest: true,
    clickAlerts: true,
    productUpdates: false,
    marketing: false,
  });

  const mutation = useMutation({
    mutationFn: updateNotifications,
    onSuccess: () => {
      toast.success('Preferences saved');
    },
    onError: () => {
      toast.error('Failed to save preferences');
    },
  });

  const handleToggle = (key: keyof typeof prefs) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    mutation.mutate(newPrefs);
  };

  const notificationItems = [
    {
      id: 'weeklyDigest',
      title: 'Weekly performance summary',
      description: 'A digest of your top links every Monday.',
    },
    {
      id: 'clickAlerts',
      title: 'Click thresholds',
      description: 'Alert when a URL hits 1,000+ clicks.',
    },
    {
      id: 'productUpdates',
      title: 'Product updates',
      description: 'Be first to know about new features and improvements.',
    },
    {
      id: 'marketing',
      title: 'Marketing emails',
      description: 'Tips, case studies, and special offers from our partners.',
    },
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-6">
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
        <p className="text-sm text-text-secondary mt-1">Choose what we email you about.</p>
      </div>

      <div className="space-y-6">
        {notificationItems.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-text-primary">{item.title}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
            </div>
            <Switch 
              checked={prefs[item.id]} 
              onChange={() => handleToggle(item.id)}
              disabled={mutation.isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
