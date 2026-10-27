'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';
import { CATEGORIES, ROOMS } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight } from 'lucide-react';
import { JournalSection } from '../components/home/JournalSection';

export const HomePage: React.FC = () => {
  const { products } = useShop();

  // Filter products for homepage sections
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const trending = products.slice(10, 18);
  const specialOffers = products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-20 pb-12">
      
      {/* SECTION 1: Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Mobile: headline + CTAs overlaid at the bottom of the hero image */}
        <div className="sm:hidden">
          <div className="relative rounded-2xl overflow-hidden h-[56vh] min-h-[320px] max-h-[480px] border border-[#E9E3DE] bg-[#1C1917]">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
              alt="Sunlit minimalist living room with ceramic vases, linen textures, and natural light"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 pointer-events-none" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-4 space-y-3">
              <div className="space-y-1.5">
                <span className="inline-block text-[10px] uppercase tracking-[0.22em] text-[#F1C0B5] font-semibold">
                  Curated Living Essentials
                </span>
                <h1 className="text-[1.65rem] font-bold text-white leading-[1.15] tracking-tight">
                  Beautiful details for every home
                </h1>
              </div>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/shop"
                  className="flex-1 px-3 py-2.5 bg-white text-[#292522] active:bg-[#FAF8F5] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/shop?new=true"
                  className="flex-1 px-3 py-2.5 bg-white/15 text-white backdrop-blur-md border border-white/40 active:bg-white/25 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop / tablet: full-bleed overlay hero */}
        <div className="relative hidden sm:flex flex-col justify-between rounded-2xl overflow-hidden min-h-[480px] lg:min-h-[540px] p-10 lg:p-14 text-white border border-[#E9E3DE]/40 shadow-sm bg-[#1C1917]">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85"
            alt="Sunlit minimalist living room with ceramic vases, linen textures, and natural light"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20 pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block text-xs uppercase tracking-[0.22em] text-[#F1C0B5] font-semibold">
              Curated Living Essentials
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-xs">
              Beautiful details for every home
            </h1>
            <p className="text-sm lg:text-base text-[#FAF8F5]/90 leading-relaxed drop-shadow-xs">
              Discover décor, flowers, and accessories to make your space feel special. Hand-cast ceramics, tactile Belgian linens, and sculptural ambient lighting.
            </p>
            <div className="pt-3 flex items-center gap-3">
              <Link
                href="/shop"
                className="px-6 py-3 bg-white text-[#292522] hover:bg-[#FAF8F5] active:bg-[#E9E3DE] text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/shop?new=true"
                className="px-6 py-3 bg-white/15 hover:bg-white/25 active:bg-white/10 text-white backdrop-blur-md border border-white/35 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          <div className="relative z-10 pt-12 flex items-center justify-between gap-3 text-xs">
            <div className="inline-flex items-center gap-2 bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white/90 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#89947D]" />
              <span>Spring Sanctuary Collection · Hand-cast stoneware</span>
            </div>
            <div className="flex items-center gap-3 text-white/75 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <span>Free delivery over $75</span>
              <span>·</span>
              <span>30-day home trial</span>
            </div>
          </div>
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
          {CATEGORIES.slice(0, 8).map((cat) => (
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
                <span className="text-xs font-medium text-[#292522] group-hover:text-[#C77F79] transition-colors block line-clamp-1">
                  {cat.shortName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: Bestsellers (8 mock products) */}
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
          {ROOMS.map((room) => (
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
