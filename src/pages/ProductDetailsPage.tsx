import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { ProductImage } from '../components/common/ProductImage';
import { ProductCard } from '../components/product/ProductCard';
import {
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface ProductDetailsPageProps {
  slug: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, products } = useShop();

  const product = products.find((p) => p.slug === slug);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0]?.name || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#292522]">Product Not Found</h2>
        <p className="text-xs text-[#77716C]">The requested interior item may have been moved or discontinued.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-5 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  // Related products
  const relatedProducts = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#77716C]">
        <button onClick={() => navigate('/')} className="hover:text-[#292522] transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('/shop')} className="hover:text-[#292522] transition-colors">
          Shop
        </button>
        <span>/</span>
        {category && (
          <>
            <button
              onClick={() => navigate(`/categories/${category.slug}`)}
              className="hover:text-[#292522] transition-colors"
            >
              {category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-[#292522] font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="rounded-xl overflow-hidden bg-white border border-[#E9E3DE] shadow-xs relative">
            <ProductImage
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              aspectRatio="4/3"
              className="w-full"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-white/95 text-[#A84940] text-xs font-semibold px-2.5 py-1 rounded border border-[#E9E3DE] shadow-xs">
                Save ${product.compareAtPrice! - product.price}
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#C77F79] ring-2 ring-[#C77F79]/20'
                      : 'border-[#E9E3DE] hover:border-[#77716C]'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-[#E9E3DE] space-y-6">
          
          <div>
            {/* Category kicker */}
            <div className="flex items-center justify-between text-xs text-[#77716C] mb-2">
              <span className="uppercase tracking-wider font-medium">
                {category?.name || 'Home Décor'}
              </span>
              <div className="flex items-center gap-1 text-[#292522]">
                <span className="font-semibold">{product.rating}</span>
                <span>★</span>
                <span className="text-[#77716C]">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-[#292522] leading-snug">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#292522] tabular-nums">
                ${product.price}
              </span>
              {hasDiscount && (
                <span className="text-sm text-[#77716C] line-through tabular-nums">
                  ${product.compareAtPrice}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs text-[#A84940] font-semibold bg-[#F1E5E1] px-2 py-0.5 rounded">
                  {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}% off
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#77716C] leading-relaxed border-t border-[#E9E3DE]/70 pt-4">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div className="space-y-2.5 border-t border-[#E9E3DE]/70 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#77716C] font-medium">Color / Finish:</span>
                <span className="font-semibold text-[#292522]">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`group relative p-1 rounded-full border-2 transition-all ${
                        isSelected ? 'border-[#292522] scale-110' : 'border-transparent hover:border-[#E9E3DE]'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="block w-6 h-6 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-3 border-t border-[#E9E3DE]/70 pt-4">
            
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#77716C] font-medium">Quantity:</span>
              <div className="flex items-center border border-[#E9E3DE] rounded-md bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1.5 hover:bg-[#E9E3DE]/60 text-[#292522] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold tabular-nums text-[#292522]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1.5 hover:bg-[#E9E3DE]/60 text-[#292522] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stock Status Label */}
              <div className="text-xs text-[#77716C] ml-auto">
                {product.stockStatus === 'in_stock' && (
                  <span className="flex items-center gap-1.5 text-[#5E6B56] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#89947D]" />
                    In stock & ready to ship
                  </span>
                )}
                {product.stockStatus === 'low_stock' && (
                  <span className="flex items-center gap-1.5 text-[#BD7157] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#BD7157]" />
                    Only 3 pieces left
                  </span>
                )}
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                  addedAnimation
                    ? 'bg-[#89947D] text-white'
                    : 'bg-[#292522] hover:bg-[#3D3834] text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Your Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-md border transition-colors flex items-center justify-center ${
                  inWishlist
                    ? 'border-[#C77F79] bg-[#F1E5E1] text-[#C77F79]'
                    : 'border-[#E9E3DE] hover:border-[#292522] text-[#77716C]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#C77F79]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Specifications Accordions */}
          <div className="border-t border-[#E9E3DE] pt-4 divide-y divide-[#E9E3DE] text-xs">
            
            {/* Dimensions & Materials */}
            <div className="py-2.5">
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center font-semibold text-[#292522] text-left"
              >
                <span>Dimensions & Material Composition</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    activeAccordion === 'details' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'details' && (
                <div className="mt-2 text-[#77716C] space-y-1.5 pl-0.5">
                  <p>
                    <strong className="text-[#292522]">Material:</strong> {product.material}
                  </p>
                  <p>
                    <strong className="text-[#292522]">Dimensions:</strong> {product.dimensions}
                  </p>
                  <p>
                    <strong className="text-[#292522]">Care:</strong> {product.careInstructions}
                  </p>
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div className="py-2.5">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center font-semibold text-[#292522] text-left"
              >
                <span>Shipping & Complimentary Returns</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    activeAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'shipping' && (
                <div className="mt-2 text-[#77716C] space-y-1 pl-0.5">
                  <p>• Free standard delivery on orders over $75.</p>
                  <p>• Dispatched in 100% recyclable, impact-tested packaging.</p>
                  <p>• 30-day effortless return window with pre-paid return label.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-[#E9E3DE] space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#292522]">You May Also Adore</h2>
              <p className="text-xs text-[#77716C] mt-0.5">Pieces curated to complement this design</p>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="text-xs font-semibold text-[#C77F79] hover:underline"
            >
              Explore Category →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Buy Bar (at bottom of screen for easy tap) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E9E3DE] p-3 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-[#77716C] block">Total</span>
          <span className="text-base font-bold text-[#292522] tabular-nums">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2.5 rounded-md border border-[#E9E3DE] text-[#77716C]"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#C77F79] text-[#C77F79]' : ''}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className="px-5 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

    </div>
  );
};
