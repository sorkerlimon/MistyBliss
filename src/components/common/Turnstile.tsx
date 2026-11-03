'use client';

import Script from 'next/script';
import React, { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: Record<string, unknown>
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      execute: (container?: HTMLElement | string, parameters?: Record<string, unknown>) => void;
      getResponse: (widgetId?: string) => string;
    };
  }
}

export type TurnstileController = {
  /** Return current token, or wait until the visible widget finishes. */
  execute: () => Promise<string>;
  reset: () => void;
};

type TurnstileProps = {
  onTokenChange: (token: string | null) => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
  controllerRef?: React.MutableRefObject<TurnstileController | null>;
};

/**
 * Cloudflare Turnstile — always visible Managed widget.
 * Token is issued when Cloudflare finishes (auto or after user interaction).
 */
export function Turnstile({
  onTokenChange,
  className = '',
  theme = 'auto',
  controllerRef,
}: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const tokenRef = useRef<string | null>(null);
  const pendingRef = useRef<{
    resolve: (token: string) => void;
    reject: (err: Error) => void;
  } | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  const emit = useCallback((token: string | null) => {
    tokenRef.current = token;
    onTokenChangeRef.current(token);
  }, []);

  const settle = useCallback((token: string | null, error?: Error) => {
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!pending) return;
    if (token) pending.resolve(token);
    else pending.reject(error || new Error('Security verification failed.'));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.turnstile) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    );
    if (!existing) return;
    const check = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(check);
        setScriptReady(true);
      }
    }, 50);
    return () => window.clearInterval(check);
  }, []);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) return;

    let cancelled = false;
    let mountedId: string | null = null;

    const mount = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;

      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }

      containerRef.current.innerHTML = '';
      emit(null);

      mountedId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: 'always',
        theme,
        size: 'normal',
        retry: 'auto',
        callback: (token: string) => {
          if (cancelled) return;
          emit(token);
          settle(token);
        },
        'error-callback': (code?: string | number) => {
          if (cancelled) return true;
          console.warn('[Turnstile] error', code);
          emit(null);
          const numeric = typeof code === 'number' ? code : Number(code);
          const family = Number.isFinite(numeric) ? Math.floor(numeric / 1000) : 0;
          const message =
            family === 110
              ? 'Security widget is blocked on this domain. In Cloudflare Turnstile → Hostname management, add “localhost”.'
              : 'Security check failed. Please refresh and try again.';
          settle(null, new Error(message));
          return true;
        },
        'expired-callback': () => {
          if (!cancelled) emit(null);
        },
        'timeout-callback': () => {
          if (cancelled) return;
          emit(null);
          settle(null, new Error('Security check timed out. Please try again.'));
        },
      });
      widgetIdRef.current = mountedId;
    };

    // Delay past React Strict Mode's immediate unmount/remount
    const timer = window.setTimeout(mount, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      // Do not reject in-flight submit on strict-mode remount; only clear widget
      if (mountedId && window.turnstile) {
        try {
          window.turnstile.remove(mountedId);
        } catch {
          /* ignore */
        }
      }
      if (widgetIdRef.current === mountedId) {
        widgetIdRef.current = null;
      }
    };
  }, [emit, scriptReady, settle, siteKey, theme]);

  useEffect(() => {
    if (!controllerRef) return;

    controllerRef.current = {
      execute: () =>
        new Promise<string>((resolve, reject) => {
          if (!siteKey) {
            resolve('');
            return;
          }
          if (tokenRef.current) {
            resolve(tokenRef.current);
            return;
          }
          if (!widgetIdRef.current || !window.turnstile) {
            reject(new Error('Security check is still loading. Please try again in a moment.'));
            return;
          }

          // Token not ready yet — wait for the visible widget callback
          pendingRef.current = { resolve, reject };

          window.setTimeout(() => {
            if (pendingRef.current) {
              pendingRef.current = null;
              reject(
                new Error('Please complete the security check (checkbox / challenge) above, then submit again.')
              );
            }
          }, 45_000);
        }),
      reset: () => {
        tokenRef.current = null;
        onTokenChangeRef.current(null);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            /* ignore */
          }
        }
      },
    };

    return () => {
      controllerRef.current = null;
    };
  }, [controllerRef, siteKey]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        id="cf-turnstile-api"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div
        ref={containerRef}
        className={`w-full min-h-[65px] flex justify-start ${className}`}
        aria-label="Security verification"
      />
    </>
  );
}

/** Client helper: verify token via our API before allowing submit. */
export async function verifyTurnstile(token: string | null): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    return null;
  }
  if (!token) {
    return 'Please complete the security check and try again.';
  }
  try {
    const response = await fetch('/api/turnstile/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await response.json().catch(() => null);
    return response.ok && data?.success
      ? null
      : data?.reason || 'Security verification failed. Please try again.';
  } catch {
    return 'Security verification is temporarily unavailable. Please try again.';
  }
}

/** Hook for forms that need a Turnstile token obtained on submit. */
export function useTurnstileToken() {
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const controllerRef = useRef<TurnstileController | null>(null);

  const reset = useCallback(() => {
    setToken(null);
    controllerRef.current?.reset();
    setWidgetKey((k) => k + 1);
  }, []);

  const obtainToken = useCallback(async (): Promise<string> => {
    if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return '';
    if (token) return token;
    if (!controllerRef.current) {
      throw new Error('Security check is still loading. Please try again in a moment.');
    }
    const next = await controllerRef.current.execute();
    setToken(next || null);
    return next;
  }, [token]);

  return { token, setToken, widgetKey, reset, obtainToken, controllerRef };
}
