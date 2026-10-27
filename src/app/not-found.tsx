'use client';

import React from 'react';
import { useRouter } from '../context/RouterContext';

export default function NotFound() {
  const { navigate } = useRouter();

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
      <span className="text-xs uppercase tracking-widest text-[#C77F79] font-bold">404 Error</span>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#292522]">Page Not Found</h1>
      <p className="text-xs text-[#77716C] max-w-sm mx-auto">
        We couldn&apos;t locate the décor page or product you were looking for.
      </p>
      <div className="pt-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md hover:bg-[#3D3834] transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
