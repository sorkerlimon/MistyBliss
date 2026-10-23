import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { Product, SortOption } from '../types';
import { Filter, X, ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ShopPageProps {
  initialCategory?: string;
  initialCollection?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialCollection,
}) => {
  const { route, navigate } = useRouter();
  const { products } = useShop();

  // Parse filters from route query or props
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || route.searchParams.category || 'all'
  );
  const [selectedRoom, setSelectedRoom] = useState<string>(
    initialCollection || route.searchParams.room || 'all'
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>(
    (route.searchParams.sort as SortOption) || 'featured'
  );
  const [pricePreset, setPricePreset] = useState<string>(
    route.searchParams.price || 'all'
  );
  const [inStockOnly, setInStockOnly] = useState<boolean>(
    route.searchParams.in_stock === 'true'
  );
  const [saleOnly, setSaleOnly] = useState<boolean>(
    route.searchParams.sale === 'true'
  );
  const [newOnly, setNewOnly] = useState<boolean>(
    route.searchParams.new === 'true'
  );
  const [bestsellerOnly, setBestsellerOnly] = useState<boolean>(
    route.searchParams.bestseller === 'true'
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    route.searchParams.material || 'all'
  );

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync props when route changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else if (route.searchParams.category) {
      setSelectedCategory(route.searchParams.category);
    }
    if (initialCollection) {
      setSelectedRoom(initialCollection);
    }
    if (route.searchParams.sale === 'true') {
      setSaleOnly(true);
    }
    if (route.searchParams.new === 'true') {
      setNewOnly(true);
    }
    if (route.searchParams.bestseller === 'true') {
      setBestsellerOnly(true);
    }
  }, [initialCategory, initialCollection, route.searchParams]);

  // Distinct materials from products
  const materials = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.material.includes('Stoneware')) set.add('Stoneware');
      if (p.material.includes('Linen')) set.add('Linen');
      if (p.material.includes('Travertine')) set.add('Travertine');
      if (p.material.includes('Brass')) set.add('Brass');
      if (p.material.includes('Terracotta')) set.add('Terracotta');
      if (p.material.includes('Glass')) set.add('Glass');
      if (p.material.includes('Cotton')) set.add('Cotton');
    });
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
        return false;
      }

      // Room / Collection filter
      if (selectedRoom !== 'all' && !product.collectionSlugs.includes(selectedRoom as any)) {
        return false;
      }

      // Price preset
      if (pricePreset === 'under-50' && product.price >= 50) return false;
      if (pricePreset === '50-100' && (product.price < 50 || product.price > 100)) return false;
      if (pricePreset === 'over-100' && product.price <= 100) return false;

      // In Stock
      if (inStockOnly && product.stockStatus === 'out_of_stock') return false;

      // Sale
      if (saleOnly && (!product.compareAtPrice || product.compareAtPrice <= product.price)) {
        return false;
      }

      // New
      if (newOnly && !product.isNew) return false;

      // Bestseller
      if (bestsellerOnly && !product.isBestseller) return false;

      // Material
      if (selectedMaterial !== 'all' && !product.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'name-asc') return a.name.localeCompare(b.name);
      // 'featured': bestsellers first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    selectedCategory,
    selectedRoom,
    pricePreset,
    inStockOnly,
    saleOnly,
    newOnly,
    bestsellerOnly,
    selectedMaterial,
    selectedSort,
  ]);

  const activeFiltersCount = [
    selectedCategory !== 'all' && !initialCategory,
    selectedRoom !== 'all' && !initialCollection,
    pricePreset !== 'all',
    inStockOnly,
    saleOnly && route.searchParams.sale !== 'true',
    newOnly && route.searchParams.new !== 'true',
    bestsellerOnly && route.searchParams.bestseller !== 'true',
    selectedMaterial !== 'all',
  ].filter(Boolean).length;

  const handleClearAllFilters = () => {
    setSelectedCategory(initialCategory || 'all');
    setSelectedRoom(initialCollection || 'all');
    setPricePreset('all');
    setInStockOnly(false);
    setSaleOnly(false);
    setNewOnly(false);
    setBestsellerOnly(false);
    setSelectedMaterial('all');
  };

  const getCategoryTitle = () => {
    if (initialCategory) {
      const cat = CATEGORIES.find((c) => c.slug === initialCategory);
      return cat ? cat.name : 'Category Collection';
    }
    if (initialCollection) {
      return `${initialCollection.replace('-', ' ').toUpperCase()} Collection`;
    }
    if (saleOnly) return 'Special Offers & Archive Sale';
    if (newOnly) return 'New Spring Arrivals';
    if (bestsellerOnly) return 'Customer Bestsellers';
    return 'All Home Décor & Living';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#77716C]">
        <button onClick={() => navigate('/')} className="hover:text-[#292522] transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('/shop')} className="hover:text-[#292522] transition-colors">
          Shop
        </button>
        {initialCategory && (
          <>
            <span>/</span>
            <span className="text-[#292522] font-medium">{getCategoryTitle()}</span>
          </>
        )}
      </nav>

      {/* Header & Product Count */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E9E3DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
            {getCategoryTitle()}
          </h1>
          <p className="text-xs text-[#77716C] mt-1">
            Showing <span className="font-semibold text-[#292522]">{filteredProducts.length}</span> thoughtfully designed pieces
          </p>
        </div>

        {/* Mobile Filter Toggle & Desktop Sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-[#E9E3DE] rounded-md text-[#292522]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#77716C] hidden sm:inline">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="bg-white border border-[#E9E3DE] rounded-md px-3 py-2 text-xs font-medium text-[#292522] focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
            >
              <option value="featured">Featured Picks</option>
              <option value="newest">Newest Additions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name-asc">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 space-y-6 border-r border-[#E9E3DE]/80 text-xs">
          
          <div className="flex items-center justify-between pb-2 border-b border-[#E9E3DE]">
            <span className="font-semibold text-sm text-[#292522] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#C77F79]" />
              Filter Catalog
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="text-[11px] text-[#A84940] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Categories Filter */}
          {!initialCategory && (
            <div className="space-y-2">
              <h4 className="font-semibold text-[#292522] text-xs uppercase tracking-wider">
                Category
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`block w-full text-left py-1 text-xs transition-colors ${
                    selectedCategory === 'all'
                      ? 'text-[#C77F79] font-semibold'
                      : 'text-[#77716C] hover:text-[#292522]'
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.categorySlug === cat.slug).length;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`block w-full text-left py-1 text-xs transition-colors ${
                        selectedCategory === cat.slug
                          ? 'text-[#C77F79] font-semibold'
                          : 'text-[#77716C] hover:text-[#292522]'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="space-y-2 pt-4 border-t border-[#E9E3DE]">
            <h4 className="font-semibold text-[#292522] text-xs uppercase tracking-wider">
              Price Range
            </h4>
            <div className="space-y-1 text-xs text-[#77716C]">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-50', label: 'Under $50' },
                { id: '50-100', label: '$50 to $100' },
                { id: 'over-100', label: '$100 and above' },
              ].map((tier) => (
                <label key={tier.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="price"
                    checked={pricePreset === tier.id}
                    onChange={() => setPricePreset(tier.id)}
                    className="accent-[#C77F79]"
                  />
                  <span className={pricePreset === tier.id ? 'text-[#292522] font-semibold' : ''}>
                    {tier.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div className="space-y-2 pt-4 border-t border-[#E9E3DE]">
            <h4 className="font-semibold text-[#292522] text-xs uppercase tracking-wider">
              Craft & Material
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedMaterial('all')}
                className={`block w-full text-left py-0.5 text-xs ${
                  selectedMaterial === 'all' ? 'text-[#C77F79] font-semibold' : 'text-[#77716C]'
                }`}
              >
                All Materials
              </button>
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`block w-full text-left py-0.5 text-xs ${
                    selectedMaterial === mat ? 'text-[#C77F79] font-semibold' : 'text-[#77716C] hover:text-[#292522]'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Availability and Special Toggles */}
          <div className="space-y-2 pt-4 border-t border-[#E9E3DE]">
            <h4 className="font-semibold text-[#292522] text-xs uppercase tracking-wider">
              Preferences
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#C77F79] rounded"
                />
                <span className="text-[#292522]">In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                  className="accent-[#C77F79] rounded"
                />
                <span className="text-[#A84940] font-medium">On Sale Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newOnly}
                  onChange={(e) => setNewOnly(e.target.checked)}
                  className="accent-[#C77F79] rounded"
                />
                <span className="text-[#292522]">New Arrivals</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area (3 cols desktop) */}
        <main className="lg:col-span-3">
          
          {/* Active filter badges strip */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 bg-white rounded-lg border border-[#E9E3DE] text-xs">
              <span className="text-[#77716C] text-[11px] font-medium">Active Filters:</span>
              
              {selectedCategory !== 'all' && !initialCategory && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#E9E3DE] px-2 py-0.5 rounded text-[11px] text-[#292522]">
                  Category: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-[#A84940]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {pricePreset !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#E9E3DE] px-2 py-0.5 rounded text-[11px] text-[#292522]">
                  Price: {pricePreset}
                  <button onClick={() => setPricePreset('all')} className="hover:text-[#A84940]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedMaterial !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#E9E3DE] px-2 py-0.5 rounded text-[11px] text-[#292522]">
                  Material: {selectedMaterial}
                  <button onClick={() => setSelectedMaterial('all')} className="hover:text-[#A84940]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {saleOnly && (
                <span className="inline-flex items-center gap-1 bg-[#F1E5E1] border border-[#E9E3DE] px-2 py-0.5 rounded text-[11px] text-[#A84940]">
                  On Sale
                  <button onClick={() => setSaleOnly(false)} className="hover:text-[#A84940]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-[11px] text-[#C77F79] hover:underline ml-auto font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Empty state */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E9E3DE] p-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#77716C] border border-[#E9E3DE]">
                <Filter className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#292522]">No matching pieces found</h3>
              <p className="text-xs text-[#77716C] max-w-sm mx-auto">
                We couldn't find items matching your active filter criteria. Try clearing some filters to see our full catalog.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 bg-[#292522] text-white text-xs font-semibold rounded-md hover:bg-[#3D3834] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Product Grid: 3 cols on desktop when sidebar is present, 2 on mobile */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end" onClick={() => setMobileFilterOpen(false)}>
          <div
            className="w-full max-w-xs h-full bg-[#FAF8F5] p-5 shadow-2xl overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9E3DE]">
                <span className="font-heading font-semibold text-sm text-[#292522]">Filter Products</span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#77716C]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-[#292522] uppercase tracking-wider mb-2">Category</p>
                <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`block w-full text-left py-1 ${selectedCategory === 'all' ? 'text-[#C77F79] font-bold' : 'text-[#77716C]'}`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`block w-full text-left py-1 ${selectedCategory === c.slug ? 'text-[#C77F79] font-bold' : 'text-[#77716C]'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-3 border-t border-[#E9E3DE]">
                <p className="text-xs font-semibold text-[#292522] uppercase tracking-wider mb-2">Price Range</p>
                <div className="space-y-1 text-xs">
                  {['all', 'under-50', '50-100', 'over-100'].map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer py-0.5">
                      <input
                        type="radio"
                        checked={pricePreset === p}
                        onChange={() => setPricePreset(p)}
                        className="accent-[#C77F79]"
                      />
                      <span>{p === 'all' ? 'All Prices' : p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-3 border-t border-[#E9E3DE] space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#C77F79]"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saleOnly}
                    onChange={(e) => setSaleOnly(e.target.checked)}
                    className="accent-[#C77F79]"
                  />
                  <span className="text-[#A84940]">On Sale Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9E3DE] flex gap-2">
              <button
                onClick={handleClearAllFilters}
                className="w-1/2 py-2 text-xs font-medium text-[#77716C] bg-white border border-[#E9E3DE] rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-2 text-xs font-semibold text-white bg-[#292522] rounded"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
