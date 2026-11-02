/** Bangladeshi Taka display helpers */

export const CURRENCY_CODE = 'BDT';
export const CURRENCY_SYMBOL = '৳';

export function formatAmountDigits(
  amount: number | null | undefined,
  options?: { compact?: boolean; showDecimals?: boolean }
): string {
  const value = Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  const showDecimals = options?.showDecimals ?? true;

  if (options?.compact) {
    return Math.round(safe).toLocaleString('en-BD');
  }

  if (showDecimals) {
    return safe.toLocaleString('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const rounded = Math.round(safe * 100) / 100;
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString('en-BD');
  }
  return rounded.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format an amount as a plain string — same size feel as digits (no gap).
 * Example: formatMoney(1200) → "৳1,200.00"
 */
export function formatMoney(
  amount: number | null | undefined,
  options?: { compact?: boolean; showDecimals?: boolean }
): string {
  return `${CURRENCY_SYMBOL}${formatAmountDigits(amount, {
    ...options,
    showDecimals: options?.compact ? false : options?.showDecimals ?? true,
  })}`;
}

export function moneySymbol(): string {
  return CURRENCY_SYMBOL;
}
