'use client';

import React, { Suspense } from 'react';
import { RouterProvider } from '../../context/RouterContext';
import { ShopProvider } from '../../context/ShopContext';
import { AnnouncementBar } from '../layout/AnnouncementBar';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { AccountModal } from '../common/AccountModal';
import { ToastContainer } from '../common/ToastContainer';
import { SEO } from '../common/SEO';
import { usePathname } from 'next/navigation';

const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F4F0] text-[#292522]">
        <SEO />
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#292522]">
      <SEO />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {/* Global Overlays */}
      <CartDrawer />
      <AccountModal />
      <ToastContainer />
    </div>
  );
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <RouterProvider>
        <ShopProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </ShopProvider>
      </RouterProvider>
    </Suspense>
  );
};
