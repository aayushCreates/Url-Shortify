import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { deleteUrl } from '../../../lib/api/urls';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  urlSlug: string | null;
}

export function DeleteConfirmModal({ isOpen, onClose, urlSlug }: DeleteConfirmModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUrl(id),
    onSuccess: () => {
      toast.success('Link deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['urls', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to delete link');
    },
  });

  const handleDelete = () => {
    if (urlSlug) {
      deleteMutation.mutate(urlSlug);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete this link?"
      description="This action cannot be undone. The short URL will immediately stop resolving."
    >
      <div className="flex flex-col items-center py-4">
        <div className="h-12 w-12 rounded-full bg-danger-bg flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-danger" />
        </div>
        <p className="text-center text-text-secondary text-sm mb-6">
          Are you sure you want to delete this link? All analytics data associated with it will also be removed permanently.
        </p>

        <div className="w-full flex gap-3">
          <Button variant="secondary" className="w-full" onClick={onClose} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            className="w-full" 
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
          >
            Delete Link
          </Button>
        </div>
      </div>
    </Modal>
  );
}
