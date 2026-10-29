'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight } from 'lucide-react';
import { JournalSection } from '../components/home/JournalSection';

export const HomePage: React.FC = () => {
  const { products, categories, rooms } = useShop();

  // All homepage product grids come from Supabase-backed shop state
  const bestsellers = useMemo(
    () => products.filter((p) => p.isBestseller).slice(0, 8),
    [products]
  );
  const newArrivals = useMemo(
    () => products.filter((p) => p.isNew).slice(0, 8),
    [products]
  );
  const trending = useMemo(() => {
    const featured = products.filter((p) => p.isFeatured || p.isBestseller);
    if (featured.length >= 8) return featured.slice(0, 8);
    const used = new Set(featured.map((p) => p.id));
    const rest = products.filter((p) => !used.has(p.id));
    return [...featured, ...rest].slice(0, 8);
  }, [products]);
  const specialOffers = useMemo(
    () => products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 8),
    [products]
  );

  return (
    <div className="space-y-16 sm:space-y-20 pb-12">
      
      {/* SECTION 1: Hero — full artwork, no crop / no overlay CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <h1 className="sr-only">Better living, beautiful spaces</h1>
        <div className="rounded-2xl overflow-hidden border border-[#E9E3DE] bg-[#FAF8F5] shadow-sm">
          <img
            src="/images/hero-beautiful-spaces.jpg"
            alt="Better living, beautiful spaces — thoughtful interior design for a comfortable home"
            className="block w-full h-auto"
          />
        </div>
      </section>

      {/* SECTION 2: Shop by Category (8 balanced tiles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-[#E9E3DE]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
              Shop by Category
            </h2>
            <p className="hidden sm:block text-xs text-[#77716C] mt-0.5">Explore pieces curated by domain and craftsmanship</p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#C77F79] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C77F79] rounded-lg cursor-pointer"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#FAF8F5] border border-[#E9E3DE] group-hover:border-[#C77F79] transition-all relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs font-medium text-[#292522] group-hover:text-[#C77F79] transition-colors block line-clamp-2 leading-snug">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-[#E9E3DE]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
              Bestsellers
            </h2>
            <p className="hidden sm:block text-xs text-[#77716C] mt-0.5">Our most beloved interior accents and ceramics</p>
          </div>
          <Link
            href="/shop?bestseller=true"
            className="text-xs font-semibold text-[#292522] hover:text-[#C77F79] flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.filter(p => p.isBestseller).length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Promotional Collection ("Bring nature indoors") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#292522] text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 p-6 sm:p-12 lg:p-14 space-y-3 sm:space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#E8C5BE]">
                Botanical Living
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Bring nature indoors
              </h2>
              <p className="hidden sm:block text-xs sm:text-sm text-[#C4BBB4] leading-relaxed">
                Hyper-realistic botanical stems, preserved dried grasses, and textured planters designed to flourish in any light.
              </p>
              <div className="pt-1 sm:pt-2">
                <Link
                  href="/categories/artificial-flowers"
                  className="px-5 py-2.5 sm:px-6 sm:py-2.5 bg-white text-[#292522] hover:bg-[#F1E5E1] active:bg-[#FAF8F5] text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Shop Floral Décor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 h-56 sm:h-80 lg:h-[360px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1100&q=80"
                alt="Botanical floral arrangements in rustic ceramic urns"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-[#E9E3DE]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
              New Arrivals
            </h2>
            <p className="hidden sm:block text-xs text-[#77716C] mt-0.5">Fresh additions to our spring stoneware and lighting collection</p>
          </div>
          <Link
            href="/shop?new=true"
            className="text-xs font-semibold text-[#292522] hover:text-[#C77F79] flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({products.filter(p => p.isNew).length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 6: Shop by Room */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-[#E9E3DE]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
              Shop by Room
            </h2>
            <p className="hidden sm:block text-xs text-[#77716C] mt-0.5">Explore cohesive aesthetics curated for every living area</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <Link
              key={room.slug}
              href={`/collections/${room.slug}`}
              className="group relative rounded-xl overflow-hidden bg-white border border-[#E9E3DE] hover:border-[#C77F79] transition-all text-left flex flex-col cursor-pointer"
            >
              <div className="h-48 w-full overflow-hidden bg-[#FAF8F5]">
                <img
                  src={room.image}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#292522] group-hover:text-[#C77F79] transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-[#77716C] mt-1 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-[#C77F79] flex items-center gap-1">
                  <span>Explore Room</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 7: Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-[#E9E3DE]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
              Trending Now
            </h2>
            <p className="hidden sm:block text-xs text-[#77716C] mt-0.5">In-demand travertine pieces, diffuse lamps, and scent rituals</p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#292522] hover:text-[#C77F79] flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 8: Special Offers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-[#E9E3DE]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#292522]">
                Special Offers
              </h2>
              <span className="text-[11px] bg-[#F1E5E1] text-[#A84940] px-2 py-0.5 rounded font-semibold">
                Limited Promotions
              </span>
            </div>
            <p className="hidden sm:block text-xs text-[#77716C] mt-0.5">Seasonal discounts on select artisanal pieces</p>
          </div>
          <Link
            href="/shop?sale=true"
            className="text-xs font-semibold text-[#A84940] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {specialOffers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 9: The Misty Bliss Journal (Editorial Blog List) */}
      <JournalSection />

    </div>
  );
};
