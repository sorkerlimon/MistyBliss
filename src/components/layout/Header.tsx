import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useShop } from '../../context/ShopContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { CATEGORIES, ROOMS } from '../../data/mockData';
import { MistyBlissIcon } from '../common/MistyBlissIcon';

export const Header: React.FC = () => {
  const { route, navigate } = useRouter();
  const { cartCount, wishlistCount, openCartDrawer, openAccountModal } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search', { q: searchQuery.trim() });
      setSearchBarOpen(false);
      setMobileMenuOpen(false);
    }
  };

  interface NavLinkItem {
    label: string;
    path: string;
    params?: Record<string, string>;
    isSale?: boolean;
  }

  const navLinks: NavLinkItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'New Arrivals', path: '/shop', params: { new: 'true' } },
    { label: 'Bestsellers', path: '/shop', params: { bestseller: 'true' } },
    { label: 'Sale', path: '/shop', params: { sale: 'true' }, isSale: true },
  ];

  const isActive = (path: string, params?: Record<string, string>) => {
    if (path === '/' && route.pathname === '/') return true;
    if (path === '/shop' && route.pathname === '/shop') {
      if (params?.new && route.searchParams.new === 'true') return true;
      if (params?.bestseller && route.searchParams.bestseller === 'true') return true;
      if (params?.sale && route.searchParams.sale === 'true') return true;
      if (!params && !route.searchParams.new && !route.searchParams.bestseller && !route.searchParams.sale) return true;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E9E3DE] transition-all">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#292522] hover:bg-[#F1E5E1] rounded-md transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setSearchBarOpen(!searchBarOpen)}
              className="p-2 text-[#292522] hover:bg-[#F1E5E1] rounded-md transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Brand Wordmark & Icon (Zone 1) */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C77F79] rounded px-1"
            >
              <MistyBlissIcon size={24} />
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#292522] group-hover:text-[#C77F79] transition-colors whitespace-nowrap">
                Misty Bliss
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links (Zone 2) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-normal text-[#292522]">
            {navLinks.map((link) => {
              const active = isActive(link.path, link.params);
              return (
                <button
                  key={link.label}
                  onClick={() => navigate(link.path, link.params)}
                  className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#C77F79] ${
                    active ? 'text-[#C77F79] font-semibold' : link.isSale ? 'text-[#A84940]' : 'text-[#292522]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C77F79] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Categories Dropdown in Header */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1 py-1 hover:text-[#C77F79] transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full -left-12 w-[520px] bg-white rounded-xl shadow-xl border border-[#E9E3DE] p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {CATEGORIES.slice(0, 10).map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        navigate(`/categories/${cat.slug}`);
                        setCategoriesDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FAF8F5] text-left transition-colors group"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
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
                    </button>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-[#E9E3DE] flex justify-between items-center text-xs">
                    <button
                      onClick={() => {
                        navigate('/shop');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="text-[#C77F79] font-medium hover:underline"
                    >
                      View All 12 Categories →
                    </button>
                    <span className="text-[#77716C]">Handcrafted with natural materials</span>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Zone (Zone 3: Search, Account, Wishlist, Bag) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop Quick Search Trigger */}
            <div className="hidden sm:block">
              {searchBarOpen ? (
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="search"
                    placeholder="Search ceramics, lighting, cushions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-48 md:w-64 pl-8 pr-7 py-1.5 text-xs bg-white border border-[#E9E3DE] rounded-full focus:outline-none focus:ring-1 focus:ring-[#C77F79] focus:border-[#C77F79]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#77716C] absolute left-2.5" />
                  <button
                    type="button"
                    onClick={() => setSearchBarOpen(false)}
                    className="absolute right-2.5 text-[#77716C] hover:text-[#292522]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchBarOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#77716C] bg-white border border-[#E9E3DE] hover:border-[#C77F79] rounded-full transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Search décor...</span>
                </button>
              )}
            </div>

            {/* Account Modal Trigger */}
            <button
              onClick={openAccountModal}
              className="p-2 text-[#292522] hover:text-[#C77F79] hover:bg-[#F1E5E1] rounded-full transition-colors relative"
              aria-label="Account"
              title="My Account"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Wishlist Link with Live Count */}
            <button
              onClick={() => navigate('/wishlist')}
              className="p-2 text-[#292522] hover:text-[#C77F79] hover:bg-[#F1E5E1] rounded-full transition-colors relative"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#C77F79] text-[#C77F79]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 bg-[#C77F79] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Drawer Trigger with Live Count */}
            <button
              onClick={openCartDrawer}
              className="p-2 text-[#292522] hover:text-[#C77F79] hover:bg-[#F1E5E1] rounded-full transition-colors relative"
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

        {/* Mobile Search Input dropdown */}
        {searchBarOpen && (
          <div className="sm:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="search"
                placeholder="Search products, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#E9E3DE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
              />
              <Search className="w-4 h-4 text-[#77716C] absolute left-3" />
              <button
                type="button"
                onClick={() => setSearchBarOpen(false)}
                className="absolute right-3 text-[#77716C]"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Secondary Horizontal Category Navigation Bar */}
      <div className="border-t border-[#E9E3DE]/70 bg-white/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-2.5 text-xs text-[#77716C] whitespace-nowrap">
            <button
              onClick={() => navigate('/shop')}
              className={`hover:text-[#292522] transition-colors shrink-0 font-medium ${
                route.pathname === '/shop' && !route.slug ? 'text-[#C77F79] font-semibold' : ''
              }`}
            >
              All Décor
            </button>
            {CATEGORIES.slice(0, 10).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => navigate(`/categories/${cat.slug}`)}
                className={`hover:text-[#292522] transition-colors shrink-0 ${
                  route.slug === cat.slug ? 'text-[#C77F79] font-semibold' : ''
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-4/5 max-w-sm h-full bg-[#FAF8F5] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E9E3DE]">
                <div className="flex items-center gap-2">
                  <MistyBlissIcon size={22} />
                  <span className="font-heading text-lg font-bold text-[#292522]">Misty Bliss</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#77716C] hover:text-[#292522]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Links */}
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      navigate(link.path, link.params);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2.5 px-3 rounded-md text-sm font-medium ${
                      link.isSale ? 'text-[#A84940] hover:bg-[#F1E5E1]' : 'text-[#292522] hover:bg-[#E9E3DE]/40'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Category Links */}
              <div className="pt-2 border-t border-[#E9E3DE]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#77716C] px-3 mb-2">
                  Shop by Category
                </p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        navigate(`/categories/${cat.slug}`);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-1.5 px-3 rounded text-xs text-[#77716C] hover:text-[#292522] hover:bg-[#E9E3DE]/30"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rooms Links */}
              <div className="pt-4 mt-2 border-t border-[#E9E3DE]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#77716C] px-3 mb-2">
                  Shop by Room
                </p>
                <div className="space-y-1">
                  {ROOMS.map((room) => (
                    <button
                      key={room.slug}
                      onClick={() => {
                        navigate(`/collections/${room.slug}`);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-1.5 px-3 rounded text-xs text-[#77716C] hover:text-[#292522] hover:bg-[#E9E3DE]/30"
                    >
                      {room.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer actions in drawer */}
            <div className="pt-6 border-t border-[#E9E3DE] text-xs text-[#77716C] space-y-2">
              <button
                onClick={() => {
                  navigate('/about');
                  setMobileMenuOpen(false);
                }}
                className="block hover:underline"
              >
                About Misty Bliss
              </button>
              <button
                onClick={() => {
                  navigate('/shipping-returns');
                  setMobileMenuOpen(false);
                }}
                className="block hover:underline"
              >
                Shipping & Returns
              </button>
              <button
                onClick={() => {
                  navigate('/contact');
                  setMobileMenuOpen(false);
                }}
                className="block hover:underline"
              >
                Contact Customer Care
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
