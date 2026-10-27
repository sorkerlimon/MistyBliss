'use client';

import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useRouter as useNextRouter, usePathname, useSearchParams } from 'next/navigation';

export type RouteType =
  | 'home'
  | 'shop'
  | 'category'
  | 'collection'
  | 'product'
  | 'search'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'contact'
  | 'shipping-returns'
  | 'admin'
  | 'not-found';

export interface RouteState {
  type: RouteType;
  slug?: string;
  searchParams: Record<string, string>;
  pathname: string;
}

interface RouterContextType {
  route: RouteState;
  navigate: (path: string, params?: Record<string, string | number | boolean>) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parsePath(pathname: string, searchParamsObj: URLSearchParams | null): RouteState {
  const searchParams: Record<string, string> = {};
  if (searchParamsObj) {
    searchParamsObj.forEach((value, key) => {
      searchParams[key] = value;
    });
  }

  const cleanPath = (pathname || '/').replace(/\/+$/, '') || '/';

  if (cleanPath === '/' || cleanPath === '') {
    return { type: 'home', pathname: '/', searchParams };
  }
  if (cleanPath === '/shop') {
    return { type: 'shop', pathname: '/shop', searchParams };
  }
  if (cleanPath === '/search') {
    return { type: 'search', pathname: '/search', searchParams };
  }
  if (cleanPath === '/wishlist') {
    return { type: 'wishlist', pathname: '/wishlist', searchParams };
  }
  if (cleanPath === '/cart') {
    return { type: 'cart', pathname: '/cart', searchParams };
  }
  if (cleanPath === '/checkout') {
    return { type: 'checkout', pathname: '/checkout', searchParams };
  }
  if (cleanPath === '/about') {
    return { type: 'about', pathname: '/about', searchParams };
  }
  if (cleanPath === '/contact') {
    return { type: 'contact', pathname: '/contact', searchParams };
  }
  if (cleanPath === '/shipping-returns') {
    return { type: 'shipping-returns', pathname: '/shipping-returns', searchParams };
  }
  if (cleanPath === '/admin') {
    return { type: 'admin', pathname: '/admin', searchParams };
  }

  // Parameterized routes
  const categoryMatch = cleanPath.match(/^\/categories\/([a-zA-Z0-9_-]+)/);
  if (categoryMatch) {
    return { type: 'category', slug: categoryMatch[1], pathname: cleanPath, searchParams };
  }

  const collectionMatch = cleanPath.match(/^\/collections\/([a-zA-Z0-9_-]+)/);
  if (collectionMatch) {
    return { type: 'collection', slug: collectionMatch[1], pathname: cleanPath, searchParams };
  }

  const productMatch = cleanPath.match(/^\/products\/([a-zA-Z0-9_-]+)/);
  if (productMatch) {
    return { type: 'product', slug: productMatch[1], pathname: cleanPath, searchParams };
  }

  return { type: 'not-found', pathname: cleanPath, searchParams };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const route = useMemo(() => {
    return parsePath(pathname || '/', searchParams);
  }, [pathname, searchParams]);

  const navigate = (path: string, params?: Record<string, string | number | boolean>) => {
    let fullUrl = path;
    if (params && Object.keys(params).length > 0) {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          sp.set(k, String(v));
        }
      });
      const queryString = sp.toString();
      if (queryString) {
        fullUrl += (path.includes('?') ? '&' : '?') + queryString;
      }
    }

    try {
      if (nextRouter && nextRouter.push) {
        nextRouter.push(fullUrl);
      } else if (typeof window !== 'undefined') {
        window.location.assign(fullUrl);
      }
    } catch {
      if (typeof window !== 'undefined') {
        window.location.assign(fullUrl);
      }
    }

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
