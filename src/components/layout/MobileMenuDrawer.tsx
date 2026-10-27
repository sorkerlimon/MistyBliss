'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES, ROOMS } from '../../data/mockData';
import { MistyBlissIcon } from '../common/MistyBlissIcon';
import { X, ArrowRight, Sparkles, Search, ChevronRight } from 'lucide-react';

export const MobileMenuDrawer: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useShop();

  // Prevent background scrolling while the drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Primary navigation links required by specification:
  // 1. All Décor
  // 2. Vases & Ceramics
  // 3. Artificial Flowers & Botanicals
  // 4. Home Accessories
  // 5. Lighting
  // 6. New Arrivals
  // 7. Best Sellers
  // 8. Sale
  const drawerLinks = [
    { label: 'All Décor', href: '/shop' },
    { label: 'Vases & Ceramics', href: '/categories/vases-ceramics' },
    { label: 'Artificial Flowers & Botanicals', href: '/categories/artificial-flowers' },
    { label: 'Home Accessories', href: '/categories/home-accessories' },
    { label: 'Lighting', href: '/categories/lighting' },
    { label: 'New Arrivals', href: '/shop?new=true', badge: 'New' },
    { label: 'Best Sellers', href: '/shop?bestseller=true', badge: 'Popular' },
    { label: 'Sale', href: '/shop?sale=true', isSale: true },
  ];

  return (
    <div
      id="mobile-navigation-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation drawer"
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
      }`}
    >
      {/* Semi-transparent backdrop overlay - clicking closes the drawer */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-in-out cursor-pointer ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Slide-in drawer panel from left with smooth CSS transition */}
      <div
        className={`fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-[#FAF8F5] shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#E9E3DE] z-10 transform transition-transform duration-300 ease-out will-change-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Drawer Top Header with Brand Logo & Visible Close (X) button */}
          <div className="p-4 sm:p-5 border-b border-[#E9E3DE] bg-white flex items-center justify-between sticky top-0 z-20">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <MistyBlissIcon size={24} />
              <span className="font-heading text-lg font-bold text-[#292522] group-hover:text-[#C77F79] transition-colors">
                Misty Bliss
              </span>
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 text-[#77716C] hover:text-[#292522] hover:bg-[#F1E5E1] active:bg-[#E9E3DE] rounded-md transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C77F79]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Bar inside Drawer */}
          <div className="p-3.5 bg-white border-b border-[#E9E3DE]">
            <Link
              href="/search"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 px-3 py-2 bg-[#FAF8F5] hover:bg-[#F1E5E1] border border-[#E9E3DE] hover:border-[#C77F79] rounded-lg text-xs text-[#77716C] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C77F79] shrink-0" />
              <span className="font-medium text-[#292522]">Search décor, ceramics, lighting...</span>
            </Link>
          </div>

          {/* Complimentary shipping promo bar */}
          <div className="px-4 py-2 bg-[#F1E5E1] text-[11px] text-[#292522] flex items-center justify-between border-b border-[#E9E3DE]">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-[#C77F79]" />
              Free shipping over $75
            </span>
            <span className="font-mono font-semibold bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[10px] border border-[#E9E3DE]">
              BLISS15
            </span>
          </div>

          {/* Main Navigation Links List (The exact 8 links) */}
          <nav aria-label="Mobile main navigation" className="p-3.5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#77716C] px-3 pb-1 block">
              Menu Navigation
            </span>
            {drawerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  link.isSale
                    ? 'text-[#A84940] hover:bg-[#F1E5E1] font-semibold'
                    : 'text-[#292522] hover:bg-[#E9E3DE]/40'
                }`}
              >
                <span>{link.label}</span>
                <div className="flex items-center gap-1.5">
                  {link.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      link.badge === 'New' ? 'bg-[#C77F79] text-white' : 'bg-[#FAF8F5] text-[#292522] border border-[#E9E3DE]'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                  {link.isSale && (
                    <span className="text-[10px] bg-[#A84940]/10 text-[#A84940] px-1.5 py-0.5 rounded font-bold">
                      Sale
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[#77716C] opacity-70" />
                </div>
              </Link>
            ))}
          </nav>

          {/* Explore Curated Spaces */}
          <div className="px-4 pt-3.5 border-t border-[#E9E3DE]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#77716C] mb-2">
              Curated Spaces & Rooms
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {ROOMS.map((room) => (
                <Link
                  key={room.slug}
                  href={`/collections/${room.slug}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 p-2 rounded-md text-[#77716C] hover:text-[#292522] hover:bg-[#E9E3DE]/30 transition-colors"
                >
                  <img
                    src={room.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded object-cover border border-[#E9E3DE] shrink-0"
                  />
                  <span className="text-[11px] font-medium truncate">{room.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* More Categories */}
          <div className="px-4 pt-4 mt-3 border-t border-[#E9E3DE]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#77716C]">
                All Categories
              </p>
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="text-[11px] font-semibold text-[#C77F79] hover:underline flex items-center gap-0.5"
              >
                <span>Full Catalog</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  onClick={closeMobileMenu}
                  className="p-1.5 rounded text-[11px] text-[#77716C] hover:text-[#292522] hover:bg-[#E9E3DE]/30 truncate block transition-colors"
                >
                  {cat.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Studio Support Footer in Drawer */}
        <div className="p-4 border-t border-[#E9E3DE] bg-white text-xs text-[#77716C] space-y-2 mt-4">
          <Link
            href="/about"
            onClick={closeMobileMenu}
            className="block hover:text-[#292522] transition-colors"
          >
            About Misty Bliss
          </Link>
          <Link
            href="/shipping-returns"
            onClick={closeMobileMenu}
            className="block hover:text-[#292522] transition-colors"
          >
            Shipping, Exchanges & Returns
          </Link>
          <Link
            href="/contact"
            onClick={closeMobileMenu}
            className="block hover:text-[#292522] transition-colors"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
};
