'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Trash2, RefreshCw, Copy, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { NewsletterSubscriber } from '../../types';

export const NewsletterAdminPanel: React.FC = () => {
  const {
    newsletterSubscribers,
    refreshNewsletterSubscribers,
    deleteNewsletterSubscriber,
    addToast,
  } = useShop();
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    refreshNewsletterSubscribers().catch(() => {});
  }, [refreshNewsletterSubscribers]);

  useEffect(() => {
    if (!deleteTarget) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeleteTarget(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteTarget]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshNewsletterSubscribers();
      addToast('Subscribers refreshed', 'Design Circle list updated');
    } finally {
      setRefreshing(false);
    }
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 1500);
    } catch {
      addToast('Copy failed', 'Could not copy email', 'info');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#292522] flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#C77F79]" />
            Design Circle Members
          </h2>
          <p className="text-[11px] text-[#77716C] mt-0.5">
            {newsletterSubscribers.length} subscriber
            {newsletterSubscribers.length === 1 ? '' : 's'} from the footer signup
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E9E3DE] hover:bg-[#FAF8F5] text-[#292522] text-xs font-semibold rounded-md cursor-pointer shrink-0 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
        {newsletterSubscribers.length === 0 ? (
          <p className="p-4 text-xs text-[#77716C]">
            No members yet. When someone joins the Design Circle on the site, they will appear here.
          </p>
        ) : (
          newsletterSubscribers.map((sub) => (
            <div key={String(sub.id)} className="p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#292522] truncate">{sub.email}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E9E3DE] text-[#77716C]">
                    {sub.source.replace(/-/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-[#A89F97] mt-0.5">{sub.createdAt || '—'}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => copyEmail(sub.email)}
                  className="p-1.5 rounded border border-[#E9E3DE] text-[#77716C] hover:text-[#292522] hover:bg-[#FAF8F5] cursor-pointer"
                  title="Copy email"
                >
                  {copiedEmail === sub.email ? (
                    <Check className="w-3.5 h-3.5 text-[#89947D]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(sub)}
                  className="p-1.5 rounded border border-[#E9E3DE] text-[#A84940] hover:bg-[#F1E5E1] cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#E9E3DE] shadow-2xl z-10 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#292522]">Remove subscriber?</h3>
              <p className="text-xs text-[#77716C] mt-1 leading-relaxed">
                “{deleteTarget.email}” will be removed from the Design Circle list.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 text-xs text-[#77716C] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteNewsletterSubscriber(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-[#A84940] text-white text-xs font-semibold rounded-md cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
