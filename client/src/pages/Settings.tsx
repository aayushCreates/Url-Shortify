import { ProfileSection } from '../components/features/settings/ProfileSection';
import { BillingSection } from '../components/features/settings/BillingSection';
import { ApiAccessSection } from '../components/features/settings/ApiAccessSection';
import { NotificationsSection } from '../components/features/settings/NotificationsSection';

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <ProfileSection />
      <BillingSection />
      <ApiAccessSection />
      <NotificationsSection />
    </div>
  );
}
