'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import { Search, X, SlidersHorizontal, ArrowUpDown, Sparkles, Check } from 'lucide-react';
type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
type PriceFilter = 'all' | 'under-40' | '40-75' | '75-120' | 'over-120';

export const SearchPage: React.FC = () => {
  const { route, navigate } = useRouter();
  const { products, categories } = useShop();
  const initialQuery = route.searchParams.q || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceFilter>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlySale, setOnlySale] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Sync query when router params change
  useEffect(() => {
    if (route.searchParams.q !== undefined && route.searchParams.q !== query) {
      setQuery(route.searchParams.q);
    }
  }, [route.searchParams.q]);

  const popularSuggestions = [
    'Stoneware',
    'Fluted Vase',
    'Travertine',
    'Terracotta',
    'Pleated Lamp',
    'Belgian Linen',
    'Soy Candle',
    'Bouclé Cushion',
    'Pampas Grass',
    'Gifts',
  ];

  // Tokenized multi-keyword search & filter algorithm
  const searchResults = useMemo(() => {
    const rawTokens = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
          return false;
        }

        // Stock filter
        if (onlyInStock && product.stockStatus !== 'in_stock') {
          return false;
        }

        // Sale filter
        if (onlySale && (!product.compareAtPrice || product.compareAtPrice <= product.price)) {
          return false;
        }

        // Price filter
        if (selectedPrice === 'under-40' && product.price >= 40) return false;
        if (selectedPrice === '40-75' && (product.price < 40 || product.price > 75)) return false;
        if (selectedPrice === '75-120' && (product.price < 75 || product.price > 120)) return false;
        if (selectedPrice === 'over-120' && product.price <= 120) return false;

        // If no keyword entered, return true (filtered by category/price)
        if (rawTokens.length === 0) {
          return true;
        }

        // Search text compilation
        const searchableText = [
          product.name,
          product.description,
          product.material,
          product.categorySlug,
          ...product.collectionSlugs,
          ...product.roomTypes,
          ...product.colors.map((c) => c.name),
        ]
          .join(' ')
          .toLowerCase();

        // Every keyword token must match somewhere in the product metadata
        return rawTokens.every((token) => searchableText.includes(token));
      })
      .sort((a, b) => {
        if (selectedSort === 'price-asc') return a.price - b.price;
        if (selectedSort === 'price-desc') return b.price - a.price;
        if (selectedSort === 'rating') return b.rating - a.rating;
        if (selectedSort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        // Default relevance: bestsellers & featured first
        return (b.isBestseller ? 2 : 0) + (b.isFeatured ? 1 : 0) - ((a.isBestseller ? 2 : 0) + (a.isFeatured ? 1 : 0));
      });
  }, [products, query, selectedCategory, selectedPrice, selectedSort, onlyInStock, onlySale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search', { q: query.trim() });
  };

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    navigate('/search', { q: keyword });
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedPrice('all');
    setSelectedSort('relevance');
    setOnlyInStock(false);
    setOnlySale(false);
    setQuery('');
    navigate('/search');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedPrice !== 'all' ||
    selectedSort !== 'relevance' ||
    onlyInStock ||
    onlySale ||
    query.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Header Hero */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1E5E1] text-[#C77F79] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Product Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#292522] tracking-tight">
          Find Your Perfect Home Décor
        </h1>
        <p className="text-sm text-[#77716C] max-w-xl mx-auto">
          Explore artisanal stoneware ceramics, lifelike botanicals, warm lighting, and textured accents.
        </p>

        {/* Live Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative mt-6 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="search"
              placeholder="Search by product name, stoneware, travertine, linen, room..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // Also update URL query smoothly without full refresh
                if (e.target.value.trim()) {
                  navigate('/search', { q: e.target.value });
                }
              }}
              autoFocus
              className="w-full pl-12 pr-11 py-3.5 text-sm sm:text-base bg-white border border-[#E9E3DE] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C77F79] focus:border-transparent text-[#292522] transition-all placeholder:text-[#A89F97]"
            />
            <Search className="w-5 h-5 text-[#77716C] absolute left-4 top-4" />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  navigate('/search');
                }}
                className="absolute right-4 top-4 text-[#77716C] hover:text-[#292522] cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        {/* Popular Keyword Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          <span className="text-xs text-[#77716C] font-medium mr-1">Trending Searches:</span>
          {popularSuggestions.map((item) => (
            <button
              key={item}
              onClick={() => handleSuggestionClick(item)}
              className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                query.toLowerCase() === item.toLowerCase()
                  ? 'bg-[#C77F79] text-white border-[#C77F79] shadow-xs'
                  : 'bg-white text-[#4A443F] border-[#E9E3DE] hover:border-[#C77F79] hover:text-[#C77F79]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-[#E9E3DE] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#292522] text-white'
                  : 'bg-[#FAF8F5] text-[#554E48] hover:bg-[#F1ECE6]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-[#C77F79] text-white'
                    : 'bg-[#FAF8F5] text-[#554E48] hover:bg-[#F1ECE6]'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>

          {/* Toggle More Filters on Mobile/Tablet */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E9E3DE]">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#292522] bg-[#FAF8F5] hover:bg-[#F1ECE6] rounded-lg border border-[#E9E3DE] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C77F79]" />
              <span>{showFilters ? 'Hide Advanced Filters' : 'Refine Filters'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#77716C] hidden md:inline">Sort:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                className="bg-[#FAF8F5] text-xs font-medium text-[#292522] border border-[#E9E3DE] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C77F79] cursor-pointer"
              >
                <option value="relevance">Featured & Relevant</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters (Price, In Stock, Sale) */}
        {showFilters && (
          <div className="pt-4 border-t border-[#E9E3DE] grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150">
            {/* Price Filter */}
            <div>
              <label className="block text-xs font-semibold text-[#292522] mb-1.5">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-40', label: 'Under $40' },
                  { id: '40-75', label: '$40 – $75' },
                  { id: '75-120', label: '$75 – $120' },
                  { id: 'over-120', label: '$120+' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedPrice(tier.id as PriceFilter)}
                    className={`px-2.5 py-1 text-xs rounded-md text-left transition-colors cursor-pointer ${
                      selectedPrice === tier.id
                        ? 'bg-[#C77F79] text-white font-medium'
                        : 'bg-[#FAF8F5] text-[#554E48] hover:bg-[#F1ECE6]'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Status */}
            <div>
              <label className="block text-xs font-semibold text-[#292522] mb-1.5">
                Stock & Offers
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#292522] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C77F79] focus:ring-[#C77F79] border-[#E9E3DE]"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#292522] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlySale}
                    onChange={(e) => setOnlySale(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C77F79] focus:ring-[#C77F79] border-[#E9E3DE]"
                  />
                  <span>Special Offers & Sale</span>
                </label>
              </div>
            </div>

            {/* Quick Reset */}
            <div className="flex flex-col justify-end">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F1ECE6] text-[#C77F79] font-medium text-xs rounded-lg border border-[#E9E3DE] transition-colors cursor-pointer w-full text-center"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E9E3DE]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#292522]">
            {searchResults.length} {searchResults.length === 1 ? 'Product' : 'Products'} Found
          </span>
          {query.trim() && (
            <span className="text-xs text-[#77716C]">
              for "<span className="text-[#292522] font-medium">{query}</span>"
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#C77F79] hover:underline font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Grid or Empty State */}
      {searchResults.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E9E3DE] p-12 text-center space-y-5 max-w-2xl mx-auto shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#C77F79] border border-[#E9E3DE]">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#292522]">No products matched your search</h3>
            <p className="text-xs text-[#77716C] max-w-md mx-auto leading-relaxed">
              We couldn't find items matching your current filters. Try searching for broader terms such as "stoneware", "vase", "lamp", or clear your price and category filters.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-[#C77F79] text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#B56F69] transition-colors shadow-xs"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#3D3834] transition-colors"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Bottom Inspiration Footer for Search */}
      <div className="pt-10 border-t border-[#E9E3DE] text-center space-y-2">
        <p className="text-xs text-[#77716C]">
          Looking for custom styling advice or bulk orders?
        </p>
        <p className="text-xs text-[#292522]">
          Our interior concierge is available via live chat or WhatsApp to assist you with material swatches and dimensions.
        </p>
      </div>
    </div>
  );
};
