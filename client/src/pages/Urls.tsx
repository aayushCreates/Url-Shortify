import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Plus, Search, Copy, Check, Pencil, Trash2, Clock, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { CreateUrlModal } from '../components/features/urls/CreateUrlModal';
import { DeleteConfirmModal } from '../components/features/urls/DeleteConfirmModal';
import { fetchUrls } from '../lib/api/urls';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate, formatNumber } from '../lib/utils/format';
import { cn } from '../lib/utils/cn';
import type { ShortUrl } from '../types/api';

export default function Urls() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState<ShortUrl | undefined>(undefined);
  const [deleteModalSlug, setDeleteModalSlug] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const debouncedSearch = useDebounce(search, 400);

  // Reset page when search changes
  useState(() => {
    setPage(1);
  });

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['urls', 'list', { search: debouncedSearch, page }],
    queryFn: () => fetchUrls({ search: debouncedSearch, page, limit: 10 }),
    placeholderData: keepPreviousData,
  });

  const handleCopy = async (id: string, slug: string) => {
    const domain = typeof window !== 'undefined' ? window.location.origin : 'https://short.ify';
    await navigator.clipboard.writeText(`${domain}/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPages = data ? Math.ceil(data.total / 10) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Your Links</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage, edit, and track all your shortened URLs.
          </p>
        </div>
        <Button onClick={() => { setEditingUrl(undefined); setIsModalOpen(true); }} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Create URL
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search URLs..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-muted border-b border-border text-xs font-medium text-text-secondary uppercase tracking-wide">
                <th className="px-5 py-3">Short URL</th>
                <th className="px-5 py-3">Original URL</th>
                <th className="px-5 py-3 text-right">Clicks</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !data ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-5 py-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-5 w-64" /></td>
                    <td className="px-5 py-4 flex justify-end"><Skeleton className="h-5 w-12" /></td>
                    <td className="px-5 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-5 py-4 flex justify-end"><Skeleton className="h-8 w-20" /></td>
                  </tr>
                ))
              ) : data?.urls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-lg font-medium text-text-primary">
                        {search ? `No results for "${search}"` : "No URLs found"}
                      </p>
                      {search ? (
                        <button 
                          onClick={() => setSearch('')}
                          className="text-primary text-sm font-medium mt-2 hover:underline"
                        >
                          Clear search
                        </button>
                      ) : (
                        <>
                          <p className="text-sm text-text-secondary mt-1 mb-4">Create your first short link to get started.</p>
                          <Button onClick={() => { setEditingUrl(undefined); setIsModalOpen(true); }}>
                            Create URL
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                data?.urls.map((url) => {
                  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
                  
                  return (
                    <tr 
                      key={url.id} 
                      className={cn(
                        "border-b border-border last:border-0 hover:bg-bg-muted/50 transition-colors",
                        isPlaceholderData && "opacity-50"
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a 
                            href={`/${url.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium text-sm hover:underline"
                          >
                            /{url.slug}
                          </a>
                          {url.hasPassword && <Lock className="h-3 w-3 text-text-muted" />}
                          {isExpired && (
                            <span className="flex items-center text-[10px] uppercase font-semibold text-danger bg-danger-bg px-1.5 py-0.5 rounded">
                              <Clock className="h-3 w-3 mr-1" />
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-text-secondary text-sm truncate max-w-[280px]" title={url.originalUrl}>
                          {url.originalUrl}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-medium text-text-primary">
                          {formatNumber((url as any).totalClicks)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-text-secondary">
                          {formatDate(url.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleCopy(url.id, url.slug)}
                            title="Copy link"
                          >
                            {copiedId === url.id ? (
                              <Check className="h-4 w-4 text-success" />
                            ) : (
                              <Copy className="h-4 w-4 text-text-secondary" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => { setEditingUrl(url); setIsModalOpen(true); }}
                            title="Edit link"
                          >
                            <Pencil className="h-4 w-4 text-text-secondary" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-danger-bg"
                            onClick={() => setDeleteModalSlug(url.slug)}
                            title="Delete link"
                          >
                            <Trash2 className="h-4 w-4 text-danger" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data && data.total > 0 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Showing <span className="font-medium text-text-primary">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-text-primary">{Math.min(page * 10, data.total)}</span> of <span className="font-medium text-text-primary">{data.total}</span>
            </span>
            <div className="flex items-center gap-1">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 text-sm font-medium">
                {page} / {totalPages}
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateUrlModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingUrl}
      />
      <DeleteConfirmModal 
        isOpen={!!deleteModalSlug} 
        onClose={() => setDeleteModalSlug(null)} 
        urlSlug={deleteModalSlug} 
      />
    </div>
  );
}
