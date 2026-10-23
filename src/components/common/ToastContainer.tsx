import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Check, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#292522] text-white p-3.5 rounded-lg shadow-xl border border-[#443F3B] flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0 text-[#C77F79]">
              {toast.type === 'sale' ? (
                <Sparkles className="w-4 h-4" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-[#A89F97]" />
              ) : (
                <Check className="w-4 h-4 text-[#89947D]" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] text-[#C4BBB4] mt-0.5 line-clamp-1">{toast.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#8C837B] hover:text-white transition-colors p-0.5 -mr-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
