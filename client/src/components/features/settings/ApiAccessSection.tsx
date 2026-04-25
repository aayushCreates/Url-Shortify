import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Copy, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { regenerateApiKey } from '../../../lib/api/settings';

export function ApiAccessSection() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey] = useState<string | null>(null); // populated when backend supports it
  const [copied, setCopied] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: regenerateApiKey,
    onSuccess: () => {
      // Will be wired when backend adds API key support
      toast.success('API key regenerated successfully');
      setIsConfirmOpen(false);
    },
    onError: (err: any) => {
      const msg = err?.message || 'Failed to regenerate API key';
      toast.error(msg);
      setIsConfirmOpen(false);
    },
  });

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-6">
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-semibold text-text-primary">API Access</h2>
        <p className="text-sm text-text-secondary mt-1">Manage your API keys for programmatic access.</p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-text-secondary">Secret Key</label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-bg-muted border border-border rounded-lg overflow-hidden px-3">
            <span className="text-sm font-mono text-text-primary py-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
              {apiKey
                ? (showKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••••••••')
                : <span className="text-text-muted italic">Not available — coming soon</span>
              }
            </span>
            <div className="ml-auto pl-2 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setShowKey(!showKey)}
                title={showKey ? "Hide key" : "Show key"}
                disabled={!apiKey}
              >
                {showKey ? <EyeOff className="h-4 w-4 text-text-secondary" /> : <Eye className="h-4 w-4 text-text-secondary" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={handleCopy}
                title="Copy key"
                disabled={!apiKey}
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-text-secondary" />}
              </Button>
            </div>
          </div>

          
          <Button 
            variant="secondary" 
            onClick={() => setIsConfirmOpen(true)}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>

        <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          Keep this key secret. Never commit it to version control or expose it in client-side code.
        </p>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Regenerate API Key?"
        description="This action cannot be undone. Your current API key will immediately stop working."
      >
        <div className="flex flex-col items-center py-4">
          <div className="h-12 w-12 rounded-full bg-danger-bg flex items-center justify-center mb-4">
            <RefreshCw className="h-6 w-6 text-danger" />
          </div>
          <p className="text-center text-text-secondary text-sm mb-6">
            Any applications currently using this key will be denied access until you update them with the new key. Are you absolutely sure?
          </p>

          <div className="w-full flex gap-3">
            <Button variant="secondary" className="w-full" onClick={() => setIsConfirmOpen(false)} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="w-full" 
              onClick={() => mutation.mutate()}
              isLoading={mutation.isPending}
            >
              Regenerate Key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
