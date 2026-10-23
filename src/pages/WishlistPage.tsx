import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/common/ProductImage';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { navigate } = useRouter();
  const { wishlist, wishlistCount, moveToCartFromWishlist, toggleWishlist, getProductById } = useShop();

  const wishlistProducts = wishlist
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#77716C]">
        <button onClick={() => navigate('/')} className="hover:text-[#292522] transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-[#292522] font-medium">My Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#E9E3DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
            My Saved Wishlist
          </h1>
          <p className="text-xs text-[#77716C] mt-1">
            {wishlistCount} {wishlistCount === 1 ? 'piece' : 'pieces'} saved to your design moodboard
          </p>
        </div>
        {wishlistCount > 0 && (
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-semibold text-[#C77F79] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Wishlist Items Grid or Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9E3DE] p-12 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F1E5E1] flex items-center justify-center text-[#C77F79]">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#292522]">Your wishlist is currently empty</h2>
          <p className="text-xs text-[#77716C] leading-relaxed">
            Click the heart icon on any vase, lamp, or cushion to save your favorites for future rooms and projects.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Explore New Arrivals
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => {
            const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-[#E9E3DE] overflow-hidden flex flex-col justify-between group hover:border-[#C77F79]/50 transition-all"
              >
                <div>
                  {/* Thumbnail */}
                  <div
                    onClick={() => navigate(`/products/${product.slug}`)}
                    className="relative cursor-pointer overflow-hidden bg-[#FAF8F5]"
                  >
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      aspectRatio="4/3"
                      className="group-hover:scale-102 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-[#77716C] hover:text-[#A84940] flex items-center justify-center shadow-xs transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 space-y-1">
                    <span className="text-[11px] text-[#77716C]">{product.material}</span>
                    <h3
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className="text-xs font-semibold text-[#292522] hover:text-[#C77F79] cursor-pointer line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-semibold text-[#292522] tabular-nums">
                        ${product.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#77716C] line-through tabular-nums">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Move to Cart Action */}
                <div className="p-3.5 pt-0">
                  <button
                    onClick={() => moveToCartFromWishlist(product.id)}
                    className="w-full py-2 px-3 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
