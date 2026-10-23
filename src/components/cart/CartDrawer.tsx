import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useRouter } from '../../context/RouterContext';
import { ProductImage } from '../common/ProductImage';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    freeShippingThreshold,
    promoDiscount,
    discountAmount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    getProductById,
  } = useShop();

  const { navigate } = useRouter();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartDrawerOpen) return null;

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const result = applyPromoCode(promoInput);
    if (!result.success) {
      setPromoError(result.message);
    } else {
      setPromoInput('');
    }
  };

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E9E3DE]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E9E3DE] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C77F79]" />
              <h2 className="text-base font-heading font-semibold text-[#292522]">
                Your Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-[#77716C] hover:text-[#292522] rounded-md transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-[#FAF8F5] px-5 py-3 border-b border-[#E9E3DE] text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-[#292522] mb-1.5 font-medium">
                Add <span className="font-semibold text-[#C77F79]">${amountNeededForFreeShipping.toFixed(2)}</span> more to unlock <span className="font-semibold">Free Shipping</span>
              </p>
            ) : (
              <p className="text-[#89947D] mb-1.5 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                You qualified for Free Standard Shipping!
              </p>
            )}
            <div className="w-full bg-[#E9E3DE] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C77F79] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#77716C]">
                <div className="w-14 h-14 mb-3 rounded-full bg-[#F1E5E1] flex items-center justify-center text-[#C77F79]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#292522] mb-1">Your bag is empty</h3>
                <p className="text-xs mb-5 max-w-xs">
                  Discover our curated ceramics, florals, and lighting to begin creating your sanctuary.
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md hover:bg-[#3D3834] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                const lineTotal = product.price * item.quantity;

                return (
                  <div
                    key={`${item.productId}-${item.selectedColor}`}
                    className="flex gap-3.5 bg-white p-3 rounded-lg border border-[#E9E3DE] transition-all hover:border-[#DED5CC]"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 shrink-0 rounded overflow-hidden">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        aspectRatio="square"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4
                            onClick={() => {
                              closeCartDrawer();
                              navigate(`/products/${product.slug}`);
                            }}
                            className="text-xs font-semibold text-[#292522] hover:text-[#C77F79] transition-colors cursor-pointer line-clamp-1"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.selectedColor)}
                            className="text-[#77716C] hover:text-[#A84940] transition-colors p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedColor && (
                          <p className="text-[11px] text-[#77716C] mt-0.5">
                            Color: <span className="text-[#292522] font-medium">{item.selectedColor}</span>
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper and Line Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#E9E3DE] rounded bg-[#FAF8F5]">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor)}
                            className="p-1 hover:bg-[#E9E3DE]/60 text-[#292522] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium tabular-nums text-[#292522]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor)}
                            className="p-1 hover:bg-[#E9E3DE]/60 text-[#292522] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-[#292522] tabular-nums">
                          ${lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Subtotals & Promo */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E9E3DE] bg-white space-y-3.5">
              
              {/* Promo input */}
              <div>
                {promoDiscount ? (
                  <div className="flex items-center justify-between text-xs bg-[#FAF8F5] p-2 rounded border border-[#E9E3DE]">
                    <div className="flex items-center gap-1.5 text-[#89947D] font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code: {promoDiscount.code} (-{promoDiscount.percent}%)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-[11px] text-[#A84940] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (try BLISS15)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium bg-[#292522] text-white rounded hover:bg-[#3D3834] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-[#A84940] mt-1">{promoError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#77716C] pt-2 border-t border-[#E9E3DE]/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#292522] tabular-nums">${cartSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#89947D]">
                    <span>Discount</span>
                    <span className="font-medium tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-medium text-[#292522] tabular-nums">
                    {shippingFee === 0 ? <span className="text-[#89947D]">FREE</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-[#292522] pt-2 border-t border-[#E9E3DE]">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Proceed to Demo Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleViewCart}
                  className="w-full py-2 px-3 text-xs font-medium text-[#77716C] hover:text-[#292522] hover:bg-[#FAF8F5] rounded transition-colors text-center"
                >
                  View Full Cart Page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
