'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, moveToCartFromWishlist } = useShop();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#77716C]">
        <Link href="/" className="hover:text-[#292522]">Home</Link>
        <span>/</span>
        <span className="text-[#292522] font-medium">Saved Items</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#E9E3DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
            My Wishlist
          </h1>
          <p className="text-xs text-[#77716C] mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-[#C77F79] hover:underline">
          Continue Browsing
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="max-w-xl mx-auto py-16 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F1E5E1] flex items-center justify-center text-[#C77F79]">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#292522]">Your wishlist is empty</h2>
          <p className="text-xs text-[#77716C]">
            Explore our artisanal pieces and tap the heart icon to save your favorite décor items.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="relative group flex flex-col">
              <ProductCard product={product} />
              <button
                onClick={() => moveToCartFromWishlist(product.id)}
                className="mt-2 w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#292522] hover:text-white border border-[#E9E3DE] rounded text-xs font-medium text-[#292522] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
