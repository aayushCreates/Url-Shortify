import { Zap } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Link } from 'react-router-dom';

export function BillingSection() {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-6">
      <div className="border-b border-border pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Billing</h2>
          <p className="text-sm text-text-secondary mt-1">Manage your subscription and billing details.</p>
        </div>
        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
          Pro
        </span>
      </div>

      <div className="bg-bg-muted rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">Pro Plan</h3>
          <p className="text-sm text-text-secondary mt-0.5">$29/month · Renews Apr 12, 2026</p>
        </div>
        <Link to="/billing">
          <Button variant="secondary" className="w-full sm:w-auto">
            Manage billing
          </Button>
        </Link>
      </div>
    </div>
  );
}
