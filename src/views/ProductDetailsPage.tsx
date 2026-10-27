'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/common/ProductImage';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check, Star, Share2 } from 'lucide-react';

interface ProductDetailsPageProps {
  slug: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { products, addToCart, toggleWishlist, isInWishlist, addToast } = useShop();

  const product = products.find((p) => p.slug === slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.[0]?.name || ''
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#292522]">Product Not Found</h1>
        <p className="text-xs text-[#77716C]">The artisanal piece you requested could not be found.</p>
        <Link
          href="/shop"
          className="inline-block px-5 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link Copied', 'Product link copied to clipboard');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#77716C]">
        <Link href="/" className="hover:text-[#292522]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#292522]">Shop</Link>
        <span>/</span>
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-[#292522] capitalize">
          {product.categorySlug.replace('-', ' ')}
        </Link>
        <span>/</span>
        <span className="text-[#292522] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Images Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#E9E3DE] relative">
            <ProductImage
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              aspectRatio="square"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx ? 'border-[#C77F79]' : 'border-transparent hover:border-[#E9E3DE]'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#C77F79] font-semibold">
              {product.material}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#292522] leading-tight">
              {product.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xl font-bold text-[#292522] tabular-nums">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-[#77716C] line-through tabular-nums">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-[#77716C] ml-auto">
                <Star className="w-3.5 h-3.5 fill-[#C77F79] text-[#C77F79]" />
                <span className="font-semibold text-[#292522]">{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#77716C] leading-relaxed">
            {product.description}
          </p>

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#E9E3DE]">
              <span className="text-xs font-semibold text-[#292522]">
                Color: <span className="font-normal text-[#77716C]">{selectedColor}</span>
              </span>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative ${
                      selectedColor === c.name ? 'border-[#292522] scale-110' : 'border-[#E9E3DE]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Dimensions */}
          {product.dimensions && (
            <div className="text-xs text-[#77716C] pt-2 border-t border-[#E9E3DE]">
              <span className="font-semibold text-[#292522]">Dimensions:</span> {product.dimensions}
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 space-y-3">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#E9E3DE] rounded-md bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-xs font-bold text-[#292522] hover:bg-[#E9E3DE]/60 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold tabular-nums text-[#292522]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-xs font-bold text-[#292522] hover:bg-[#E9E3DE]/60 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-5 bg-[#292522] hover:bg-[#3D3834] active:bg-[#1a1715] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer touch-manipulation"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag · ${(product.price * quantity).toFixed(2)}</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-md border transition-colors cursor-pointer ${
                  inWishlist
                    ? 'border-[#C77F79] bg-[#F1E5E1] text-[#C77F79]'
                    : 'border-[#E9E3DE] text-[#77716C] hover:border-[#292522] hover:text-[#292522]'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-3 rounded-md border border-[#E9E3DE] text-[#77716C] hover:border-[#292522] hover:text-[#292522] transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="bg-white p-4 rounded-xl border border-[#E9E3DE] space-y-2.5 text-xs text-[#77716C]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#C77F79]" />
              <span>Complimentary shipping on orders over $75</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#C77F79]" />
              <span>30-day hassle-free studio returns</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#89947D]" />
              <span>Artisan-crafted with natural organic finishes</span>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-[#E9E3DE] space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#292522]">Complementary Pieces</h2>
            <Link href="/shop" className="text-xs text-[#C77F79] font-medium hover:underline">
              View All Décor →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
