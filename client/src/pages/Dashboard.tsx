import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DashboardStatCards } from '../components/features/dashboard/DashboardStatCards';
import { ClicksAreaChart } from '../components/features/dashboard/ClicksAreaChart';
import { TopUrlsChart } from '../components/features/dashboard/TopUrlsChart';
import { CreateUrlModal } from '../components/features/urls/CreateUrlModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Welcome back. Here's what's happening.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Create URL
        </Button>
      </div>

      {/* Stat Cards */}
      <DashboardStatCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ClicksAreaChart />
        </div>
        <div className="lg:col-span-1">
          <TopUrlsChart />
        </div>
      </div>

      {/* Create URL Modal */}
      <CreateUrlModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
