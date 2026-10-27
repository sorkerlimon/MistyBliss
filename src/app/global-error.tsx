'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAF8F5] text-[#292522] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E9E3DE] shadow-sm text-center space-y-4">
          <h2 className="text-xl font-bold text-[#292522]">Something went wrong</h2>
          <p className="text-xs text-[#77716C]">
            An unexpected error occurred while loading this page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
