'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import { Search, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { route, navigate } = useRouter();
  const { products } = useShop();
  const initialQuery = route.searchParams.q || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (route.searchParams.q !== undefined) {
      setQuery(route.searchParams.q);
    }
  }, [route.searchParams.q]);

  const suggestions = [
    'Stoneware',
    'Travertine',
    'Vase',
    'Linen',
    'Candle',
    'Bouclé',
    'Lamp',
    'Diffuser',
    'Terracotta',
  ];

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.categorySlug.toLowerCase().includes(q) ||
        product.collectionSlugs.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [products, query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/search', { q: query.trim() });
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    navigate('/search', { q: keyword });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and Search Input */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
          Search Décor & Accents
        </h1>
        <p className="text-xs text-[#77716C]">
          Find ceramics, botanicals, lighting, and textiles for your home
        </p>

        <form onSubmit={handleSearchSubmit} className="relative mt-4">
          <input
            type="search"
            placeholder="Search by product name, stone, material, or room..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-11 pr-10 py-3 text-sm bg-white border border-[#E9E3DE] rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C77F79] focus:border-transparent text-[#292522]"
          />
          <Search className="w-5 h-5 text-[#77716C] absolute left-3.5 top-3.5" />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                navigate('/search');
              }}
              className="absolute right-3.5 top-3.5 text-[#77716C] hover:text-[#292522] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          <span className="text-[11px] text-[#77716C] mr-1">Popular:</span>
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => handleSuggestionClick(item)}
              className="px-2.5 py-1 text-xs bg-white border border-[#E9E3DE] hover:border-[#C77F79] hover:text-[#C77F79] rounded-md transition-colors text-[#292522] cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6 pt-4">
        {query.trim() ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3DE] mb-6">
              <p className="text-xs text-[#77716C]">
                Search results for <span className="font-semibold text-[#292522]">"{query}"</span>
              </p>
              <span className="text-xs font-semibold text-[#292522] tabular-nums">
                {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E9E3DE] p-12 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#77716C]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#292522]">No items matched your query</h3>
                <p className="text-xs text-[#77716C] max-w-sm mx-auto">
                  Try searching for a broader term such as "vase", "linen", "stone", or explore our curated categories.
                </p>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-5 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md cursor-pointer hover:bg-[#3D3834] transition-colors"
                >
                  Browse All Décor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* When no query entered yet, show featured picks */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3DE]">
              <h2 className="text-base font-semibold text-[#292522]">Suggested Inspirations</h2>
              <button
                onClick={() => navigate('/shop')}
                className="text-xs text-[#C77F79] font-medium hover:underline cursor-pointer"
              >
                View Catalog →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
