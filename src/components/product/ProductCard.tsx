import React from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { useRouter } from '../../context/RouterContext';
import { ProductImage } from '../common/ProductImage';
import { Heart, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  aspectRatio?: '4/3' | 'square' | '3/4';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspectRatio = '4/3',
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { navigate } = useRouter();
  const [justAdded, setJustAdded] = React.useState(false);

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-lg border border-[#E9E3DE]/80 hover:border-[#C77F79]/50 hover:shadow-sm transition-all duration-200 overflow-hidden"
    >
      {/* Image Container with controls */}
      <div className="relative w-full overflow-hidden bg-[#FAF8F5]">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          aspectRatio={aspectRatio}
          className="group-hover:scale-102 transition-transform duration-300"
        />

        {/* Minimal Unboxed Status / Kicker */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[11px] font-medium tracking-tight">
          {hasDiscount && (
            <span className="bg-[#FAF8F5]/90 backdrop-blur-xs text-[#A84940] px-2 py-0.5 rounded text-[11px] font-semibold border border-[#E9E3DE]">
              Save ${product.compareAtPrice! - product.price}
            </span>
          )}
          {product.isNew && !hasDiscount && (
            <span className="bg-[#FAF8F5]/90 backdrop-blur-xs text-[#292522] px-2 py-0.5 rounded text-[11px] font-medium border border-[#E9E3DE]">
              New Arrival
            </span>
          )}
          {product.isBestseller && !product.isNew && !hasDiscount && (
            <span className="bg-[#FAF8F5]/90 backdrop-blur-xs text-[#77716C] px-2 py-0.5 rounded text-[11px] font-medium border border-[#E9E3DE]">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
            inWishlist
              ? 'bg-[#C77F79] text-white'
              : 'bg-white/90 backdrop-blur-xs text-[#77716C] hover:text-[#C77F79] hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white stroke-white' : ''}`} />
        </button>

        {/* Quick Add Overlay Button on desktop hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all shadow-md ${
              justAdded
                ? 'bg-[#89947D] text-white'
                : 'bg-[#292522] text-white hover:bg-[#3D3834]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Material / Category quiet metadata */}
          <div className="text-[11px] text-[#77716C] tracking-wide mb-1 flex items-center gap-1.5 truncate">
            <span>{product.material}</span>
            <span aria-hidden="true">·</span>
            <span>{product.dimensions.split('(')[0].trim()}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-[#292522] group-hover:text-[#C77F79] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Price and Mobile Add Button */}
        <div className="pt-2 border-t border-[#E9E3DE]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-[#292522] tabular-nums">
              ${product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#77716C] line-through tabular-nums">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Mobile direct Add button */}
          <button
            onClick={handleAddToCart}
            className={`sm:hidden p-1.5 rounded-md text-xs font-medium transition-colors ${
              justAdded
                ? 'bg-[#89947D] text-white'
                : 'bg-[#FAF8F5] hover:bg-[#F1E5E1] text-[#292522] border border-[#E9E3DE]'
            }`}
            aria-label="Add to bag"
          >
            {justAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
};
