import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Store announcement" className="bg-[#F1E5E1] text-[#292522] border-b border-[#E9E3DE] py-2 px-4 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs tracking-tight">
        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C77F79] hidden sm:inline-block shrink-0" />
          <span>
            <strong className="font-semibold">Spring Home Collection:</strong> Free shipping on qualifying orders over $75
          </span>
          <span className="hidden md:inline text-[#77716C]">·</span>
          <span className="hidden md:inline text-[#77716C]">
            Use code <span className="font-mono font-medium text-[#292522] bg-[#FAF8F5] px-1 py-0.5 rounded border border-[#E9E3DE]">BLISS15</span> for 15% off
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 -mr-1 text-[#77716C] hover:text-[#292522] transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
