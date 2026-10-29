'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from '../../context/RouterContext';
import { useShop } from '../../context/ShopContext';
import {
  Search,
  Heart,
  ShoppingBag,
  // User, // Account icon — kept for future
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { MistyBlissIcon } from '../common/MistyBlissIcon';
import { MobileMenuDrawer } from './MobileMenuDrawer';

export const Header: React.FC = () => {
  const { route, navigate } = useRouter();
  const {
    cartCount,
    wishlistCount,
    openCartDrawer,
    // openAccountModal, // Account icon — kept for future
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    categories,
  } = useShop();

  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  // Handle ESC key to dismiss search or dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchBarOpen(false);
        setCategoriesDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close the mobile drawer when the viewport reaches desktop nav width
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        closeMobileMenu();
      }
    };
    onChange(media);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [closeMobileMenu]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search', { q: searchQuery.trim() });
      setSearchBarOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?new=true' },
    { label: 'Bestsellers', href: '/shop?bestseller=true' },
    { label: 'Sale', href: '/shop?sale=true', isSale: true },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/' && route.pathname === '/') return true;
    if (href === '/shop' && route.pathname === '/shop' && !route.searchParams.new && !route.searchParams.bestseller && !route.searchParams.sale) return true;
    if (href.includes('new=true') && route.searchParams.new === 'true') return true;
    if (href.includes('bestseller=true') && route.searchParams.bestseller === 'true') return true;
    if (href.includes('sale=true') && route.searchParams.sale === 'true') return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E9E3DE] transition-all">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Menu trigger — mobile/tablet only; desktop uses the main nav */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 lg:hidden">
            <button
              type="button"
              id="mobile-menu-trigger"
              onClick={() => toggleMobileMenu()}
              className="p-2 sm:p-2.5 text-[#292522] hover:bg-[#F1E5E1] active:bg-[#E9E3DE] rounded-md transition-colors flex items-center justify-center min-w-[42px] min-h-[42px] cursor-pointer touch-manipulation select-none active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C77F79]"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link
              href="/search"
              className="p-2 sm:p-2.5 text-[#292522] hover:bg-[#F1E5E1] active:bg-[#E9E3DE] rounded-md transition-colors flex items-center justify-center min-w-[38px] min-h-[38px] cursor-pointer touch-manipulation select-none sm:hidden"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </Link>
          </div>

          {/* Brand Wordmark & Icon (Zone 1) */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start min-w-0">
            <Link
              href="/"
              className="group flex items-center gap-1.5 sm:gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C77F79] rounded px-1 cursor-pointer"
            >
              <MistyBlissIcon size={22} className="shrink-0" />
              <span className="font-heading text-lg sm:text-2xl font-bold tracking-tight text-[#292522] group-hover:text-[#C77F79] transition-colors whitespace-nowrap">
                Misty Bliss
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Zone 2) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-normal text-[#292522]">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#C77F79] cursor-pointer ${
                    active ? 'text-[#C77F79] font-semibold' : link.isSale ? 'text-[#A84940]' : 'text-[#292522]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C77F79] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Categories Dropdown in Header */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1 py-1 hover:text-[#C77F79] transition-colors cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full -left-12 w-[520px] bg-white rounded-xl shadow-xl border border-[#E9E3DE] p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {categories.slice(0, 10).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAF8F5] text-left transition-colors group cursor-pointer"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-md object-cover border border-[#E9E3DE]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#292522] group-hover:text-[#C77F79] transition-colors">
                          {cat.name}
                        </div>
                        <div className="text-[11px] text-[#77716C] line-clamp-1">
                          {cat.shortName}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-[#E9E3DE] flex justify-between items-center text-xs">
                    <Link
                      href="/shop"
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="text-[#C77F79] font-medium hover:underline cursor-pointer"
                    >
                      View All {categories.length} Categories →
                    </Link>
                    <span className="text-[#77716C]">Handcrafted with natural materials</span>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Zone (Zone 3: Search, Account, Wishlist, Bag) */}
          <div className="flex items-center gap-0.5 sm:gap-2">
            {/* Desktop Quick Search Form */}
            <div className="hidden sm:block">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="search"
                  placeholder="Search décor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 md:w-56 pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E9E3DE] hover:border-[#C77F79]/60 rounded-full focus:outline-none focus:ring-1 focus:ring-[#C77F79] focus:border-[#C77F79] transition-colors text-[#292522]"
                />
                <button
                  type="submit"
                  className="absolute left-2.5 text-[#77716C] hover:text-[#C77F79] cursor-pointer"
                  aria-label="Submit search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Account Modal Trigger — kept for future
            <button
              type="button"
              onClick={openAccountModal}
              className="p-2 text-[#292522] hover:text-[#C77F79] hover:bg-[#F1E5E1] active:bg-[#E9E3DE] rounded-full transition-colors relative cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation select-none"
              aria-label="Account"
              title="My Account"
            >
              <User className="w-4 h-4" />
            </button>
            */}

            {/* Wishlist Link with Live Count */}
            <Link
              href="/wishlist"
              className="p-2 text-[#292522] hover:text-[#C77F79] hover:bg-[#F1E5E1] active:bg-[#E9E3DE] rounded-full transition-colors relative cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation select-none"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#C77F79] text-[#C77F79]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 bg-[#C77F79] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Drawer Trigger with Live Count */}
            <button
              type="button"
              onClick={openCartDrawer}
              className="p-2 text-[#292522] hover:text-[#C77F79] hover:bg-[#F1E5E1] active:bg-[#E9E3DE] rounded-full transition-colors relative cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation select-none"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 bg-[#292522] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Horizontal Category Navigation Bar */}
      <div className="border-t border-[#E9E3DE]/70 bg-white/70 overflow-x-auto scrollbar-none overscroll-x-contain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 py-2 sm:py-2.5 text-xs text-[#77716C] whitespace-nowrap">
            <Link
              href="/shop"
              className={`hover:text-[#292522] transition-colors shrink-0 font-medium cursor-pointer ${
                route.pathname === '/shop' && !route.slug ? 'text-[#C77F79] font-semibold' : ''
              }`}
            >
              All Décor
            </Link>
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`hover:text-[#292522] transition-colors shrink-0 cursor-pointer ${
                  route.slug === cat.slug ? 'text-[#C77F79] font-semibold' : ''
                }`}
              >
                {cat.shortName || cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Navigation Drawer */}
      <MobileMenuDrawer />
    </header>
  );
};
