'use client';

import React from 'react';
import { formatAmountDigits } from '../../lib/money';

interface MoneyProps {
  amount: number | null | undefined;
  className?: string;
  muted?: boolean;
  compact?: boolean;
  showDecimals?: boolean;
}

/**
 * BDT amount — ৳ and digits share one size and sit on the same vertical center.
 */
export const Money: React.FC<MoneyProps> = ({
  amount,
  className = '',
  muted = false,
  compact,
  showDecimals = true,
}) => {
  const digits = formatAmountDigits(amount, {
    compact,
    showDecimals: compact ? false : showDecimals,
  });

  return (
    <span
      className={`inline-flex items-center tabular-nums whitespace-nowrap leading-none ${
        muted ? 'font-medium' : 'font-semibold'
      } ${className}`}
      aria-label={`৳${digits}`}
      style={{ lineHeight: 1 }}
    >
      <span
        aria-hidden="true"
        className="shrink-0 font-semibold"
        style={{
          fontSize: '1em',
          lineHeight: 1,
          fontFamily:
            '"Noto Sans Bengali", "Noto Sans", "Segoe UI", system-ui, sans-serif',
          // Pull symbol down slightly so it lines up with Latin digits
          position: 'relative',
          top: '0.08em',
        }}
      >
        ৳
      </span>
      <span
        className="leading-none tracking-tight"
        style={{
          // Lift digits to share the symbol’s optical center
          position: 'relative',
          top: '-0.02em',
        }}
      >
        {digits}
      </span>
    </span>
  );
};
