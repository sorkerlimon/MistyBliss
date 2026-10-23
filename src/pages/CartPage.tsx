import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/common/ProductImage';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
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

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

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

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F1E5E1] flex items-center justify-center text-[#C77F79]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-[#292522]">Your bag is empty</h1>
        <p className="text-xs text-[#77716C] max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our handcrafted ceramics, lamps, and botanicals.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#77716C]">
        <button onClick={() => navigate('/')} className="hover:text-[#292522] transition-colors">
          Home
        </button>
        <span>/</span>
        <span className="text-[#292522] font-medium">Shopping Bag</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#E9E3DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
            Shopping Bag
          </h1>
          <p className="text-xs text-[#77716C] mt-1">
            Review your {cartCount} {cartCount === 1 ? 'item' : 'items'} before proceeding to secure checkout
          </p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="text-xs font-semibold text-[#C77F79] hover:underline"
        >
          Continue Shopping
        </button>
      </div>

      {/* Two Column Layout: Items List (8 cols) + Order Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Meter */}
          <div className="bg-white p-4 rounded-xl border border-[#E9E3DE] space-y-2">
            <div className="flex justify-between items-center text-xs">
              {amountNeededForFreeShipping > 0 ? (
                <p className="text-[#292522]">
                  Add <span className="font-semibold text-[#C77F79]">${amountNeededForFreeShipping.toFixed(2)}</span> more to qualify for <span className="font-semibold">Free Delivery</span>
                </p>
              ) : (
                <p className="text-[#89947D] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Your order qualifies for Free Standard Shipping!
                </p>
              )}
              <span className="text-[11px] text-[#77716C] font-mono tabular-nums">
                ${cartSubtotal.toFixed(2)} / ${freeShippingThreshold}
              </span>
            </div>
            <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden border border-[#E9E3DE]">
              <div
                className="bg-[#C77F79] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Table */}
          <div className="bg-white rounded-xl border border-[#E9E3DE] divide-y divide-[#E9E3DE] overflow-hidden">
            {cart.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              const lineTotal = product.price * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.selectedColor}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className="w-20 h-20 rounded-lg overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E9E3DE] cursor-pointer"
                    >
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        aspectRatio="square"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-[#77716C] uppercase tracking-wider block">
                        {product.material}
                      </span>
                      <h3
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className="text-sm font-semibold text-[#292522] hover:text-[#C77F79] cursor-pointer line-clamp-1 transition-colors"
                      >
                        {product.name}
                      </h3>
                      {item.selectedColor && (
                        <p className="text-xs text-[#77716C]">
                          Selected Color: <span className="text-[#292522] font-medium">{item.selectedColor}</span>
                        </p>
                      )}
                      <p className="text-xs text-[#292522] font-medium sm:hidden">
                        ${product.price} each
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper, Line Price & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E9E3DE]/60">
                    
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E9E3DE] rounded-md bg-[#FAF8F5]">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedColor)}
                        className="p-1.5 hover:bg-[#E9E3DE]/60 text-[#292522] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold tabular-nums text-[#292522]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedColor)}
                        className="p-1.5 hover:bg-[#E9E3DE]/60 text-[#292522] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-semibold text-[#292522] tabular-nums block">
                        ${lineTotal.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#77716C] hidden sm:block">
                        (${product.price} ea)
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedColor)}
                      className="text-[#77716C] hover:text-[#A84940] transition-colors p-1"
                      aria-label="Remove item from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Box (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-5">
          <h2 className="text-base font-semibold text-[#292522] pb-3 border-b border-[#E9E3DE]">
            Order Summary
          </h2>

          {/* Promo code */}
          <div>
            {promoDiscount ? (
              <div className="flex items-center justify-between text-xs bg-[#FAF8F5] p-2.5 rounded border border-[#E9E3DE]">
                <div className="flex items-center gap-1.5 text-[#89947D] font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo {promoDiscount.code} (-{promoDiscount.percent}%)</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-[11px] text-[#A84940] hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. BLISS15)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-[#A84940]">{promoError}</p>
                )}
              </form>
            )}
          </div>

          {/* Calculations */}
          <div className="space-y-2.5 text-xs text-[#77716C] pt-2 border-t border-[#E9E3DE]/70">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#292522] tabular-nums">${cartSubtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#89947D]">
                <span>Promotional Savings</span>
                <span className="font-semibold tabular-nums">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-[#292522] tabular-nums">
                {shippingFee === 0 ? <span className="text-[#89947D]">FREE</span> : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax</span>
              <span className="text-[#77716C] italic">Calculated at checkout</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#292522] pt-3 border-t border-[#E9E3DE]">
              <span>Estimated Total</span>
              <span className="tabular-nums">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 px-4 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Guarantees */}
          <div className="pt-2 text-[11px] text-[#77716C] flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#89947D]" />
            <span>Guaranteed safe and secure checkout</span>
          </div>
        </div>

      </div>

    </div>
  );
};
