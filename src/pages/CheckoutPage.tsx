import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/common/ProductImage';
import { CheckCircle2, ShieldCheck, ArrowRight, Truck, CreditCard, Box, Lock } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    cart,
    cartSubtotal,
    shippingFee,
    promoDiscount,
    discountAmount,
    clearCart,
    getProductById,
    createOrder,
  } = useShop();

  // Form states
  const [email, setEmail] = useState('elena.rostova@example.com');
  const [firstName, setFirstName] = useState('Elena');
  const [lastName, setLastName] = useState('Rostova');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [apartment, setApartment] = useState('Apt 3B');
  const [city, setCity] = useState('Portland');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97201');
  const [phone, setPhone] = useState('+1 (503) 555-0192');
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('389');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  // Calculations
  const selectedShippingCost = shippingSpeed === 'express' ? 14.0 : shippingFee;
  const estimatedTax = Math.round(cartSubtotal * 0.05 * 100) / 100;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + selectedShippingCost + estimatedTax);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid email is required';
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!address.trim()) errors.address = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!state.trim()) errors.state = 'State is required';
    if (!postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!phone.trim()) errors.phone = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orderItems = cart.map((i) => {
        const prod = getProductById(i.productId);
        return {
          productId: i.productId,
          name: prod?.name || 'Home Décor Item',
          price: prod?.price || 0,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          image: prod?.images[0],
        };
      });

      const newOrder = createOrder({
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        customerName: `${firstName} ${lastName}`.trim(),
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: `${address}${apartment ? ', ' + apartment : ''}, ${city}, ${state} ${postalCode}`,
        items: orderItems,
        subtotal: cartSubtotal,
        discount: discountAmount,
        shippingFee: selectedShippingCost,
        total: finalTotal,
        paymentMethod,
        shippingSpeed,
      });

      const confirmedOrder = {
        orderNumber: newOrder.id,
        date: newOrder.date,
        items: cart.map((i) => ({
          ...i,
          product: getProductById(i.productId),
        })),
        shippingAddress: newOrder.shippingAddress,
        email,
        phone,
        total: finalTotal,
        paymentMethod,
        shippingSpeed,
      };

      setOrderConfirmed(confirmedOrder);
      clearCart();
      setIsSubmitting(false);
    }, 700);
  };

  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-[#E9E3DE] p-6 sm:p-10 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#89947D]/15 text-[#5E6B56] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <span className="text-xs uppercase tracking-widest text-[#C77F79] font-semibold">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
            Thank You, {firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#77716C] max-w-md mx-auto leading-relaxed">
            Your demonstration order <span className="font-semibold text-[#292522]">#{orderConfirmed.orderNumber}</span> has been confirmed. A confirmation receipt has been sent to <span className="text-[#292522] font-medium">{email}</span>.
          </p>

          {/* Delivery estimate */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E9E3DE] max-w-md mx-auto text-left text-xs space-y-2 mt-4">
            <div className="flex items-center gap-2 text-[#292522] font-semibold">
              <Truck className="w-4 h-4 text-[#C77F79]" />
              <span>Estimated Delivery: 3–5 Business Days</span>
            </div>
            <p className="text-[#77716C]">
              Delivering to: <span className="text-[#292522]">{orderConfirmed.shippingAddress}</span>
            </p>
          </div>

          {/* Item summary */}
          <div className="pt-4 border-t border-[#E9E3DE] text-left text-xs space-y-3">
            <h3 className="font-semibold text-[#292522]">Purchased Items ({orderConfirmed.items.length})</h3>
            <div className="divide-y divide-[#E9E3DE]">
              {orderConfirmed.items.map((item: any) => (
                <div key={`${item.productId}-${item.selectedColor}`} className="py-2.5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-[#FAF8F5] overflow-hidden border border-[#E9E3DE] shrink-0">
                      {item.product && (
                        <ProductImage src={item.product.images[0]} alt={item.product.name} aspectRatio="square" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#292522] line-clamp-1">{item.product?.name}</p>
                      <p className="text-[11px] text-[#77716C]">
                        Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#292522] tabular-nums">
                    ${(item.product?.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E9E3DE] flex justify-between items-center text-sm font-bold text-[#292522]">
              <span>Total Paid</span>
              <span className="tabular-nums">${orderConfirmed.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#292522]">Your bag is empty</h2>
        <p className="text-xs text-[#77716C]">Please add items to your shopping bag before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-5 py-2.5 bg-[#292522] text-white text-xs font-semibold rounded-md"
        >
          Explore Décor
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#77716C]">
        <button onClick={() => navigate('/cart')} className="hover:text-[#292522] transition-colors">
          Shopping Bag
        </button>
        <span>/</span>
        <span className="text-[#292522] font-medium">Demo Checkout</span>
      </nav>

      <div className="flex items-center gap-2 pb-2 border-b border-[#E9E3DE]">
        <Lock className="w-4 h-4 text-[#89947D]" />
        <h1 className="text-xl sm:text-2xl font-bold text-[#292522]">
          Secure Demo Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Contact Information */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E9E3DE] space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292522] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#292522] text-white text-[10px] flex items-center justify-center font-bold">1</span>
              Contact Information
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                    formErrors.email ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                  }`}
                  placeholder="name@example.com"
                />
                {formErrors.email && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Phone Number (for courier updates) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                    formErrors.phone ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                  }`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E9E3DE] space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292522] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#292522] text-white text-[10px] flex items-center justify-center font-bold">2</span>
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  placeholder="House number and street name"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Apartment, Suite, Unit (Optional)</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Delivery Options */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E9E3DE] space-y-3 text-xs">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292522] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#292522] text-white text-[10px] flex items-center justify-center font-bold">3</span>
              Delivery Option
            </h2>

            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  shippingSpeed === 'standard' ? 'border-[#C77F79] bg-[#FAF8F5]' : 'border-[#E9E3DE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingSpeed === 'standard'}
                    onChange={() => setShippingSpeed('standard')}
                    className="accent-[#C77F79]"
                  />
                  <div>
                    <p className="font-semibold text-[#292522]">Standard Carbon-Neutral Delivery</p>
                    <p className="text-[#77716C] text-[11px]">3–5 business days</p>
                  </div>
                </div>
                <span className="font-semibold text-[#292522] tabular-nums">
                  {shippingFee === 0 ? <span className="text-[#89947D]">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  shippingSpeed === 'express' ? 'border-[#C77F79] bg-[#FAF8F5]' : 'border-[#E9E3DE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingSpeed === 'express'}
                    onChange={() => setShippingSpeed('express')}
                    className="accent-[#C77F79]"
                  />
                  <div>
                    <p className="font-semibold text-[#292522]">Expedited Priority Delivery</p>
                    <p className="text-[#77716C] text-[11px]">1–2 business days via FedEx Air</p>
                  </div>
                </div>
                <span className="font-semibold text-[#292522] tabular-nums">$14.00</span>
              </label>
            </div>
          </div>

          {/* Step 4: Payment Simulation */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E9E3DE] space-y-4 text-xs">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292522] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#292522] text-white text-[10px] flex items-center justify-center font-bold">4</span>
              Payment Selection (Simulated)
            </h2>

            <div className="space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#292522]">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#C77F79]"
                  />
                  <span>Credit / Debit Card</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#292522]">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#C77F79]"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-2 p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E3DE]">
                  <div>
                    <label className="block text-[11px] font-medium text-[#77716C] mb-1">Demo Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#E9E3DE] rounded text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-[#77716C] mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#E9E3DE] rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#77716C] mb-1">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-[#E9E3DE] rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E3DE] text-xs text-[#77716C]">
                  Pay in cash upon courier delivery. Please ensure exact change is available.
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Confirming Demo Order...</span>
            ) : (
              <>
                <span>Place Demo Order · ${finalTotal.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right: Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292522] pb-3 border-b border-[#E9E3DE]">
            Your Bag ({cart.length})
          </h2>

          <div className="divide-y divide-[#E9E3DE] max-h-72 overflow-y-auto">
            {cart.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <div key={`${item.productId}-${item.selectedColor}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-[#FAF8F5] overflow-hidden border border-[#E9E3DE] shrink-0">
                      <ProductImage src={product.images[0]} alt={product.name} aspectRatio="square" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#292522] line-clamp-1">{product.name}</p>
                      <p className="text-[11px] text-[#77716C]">
                        Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#292522] tabular-nums">
                    ${(product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing breakdown */}
          <div className="pt-3 border-t border-[#E9E3DE] space-y-2 text-xs text-[#77716C]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#292522] tabular-nums">${cartSubtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#89947D]">
                <span>Promotional Discount ({promoDiscount?.code})</span>
                <span className="font-semibold tabular-nums">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="font-semibold text-[#292522] tabular-nums">
                {selectedShippingCost === 0 ? <span className="text-[#89947D]">FREE</span> : `$${selectedShippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax (5%)</span>
              <span className="font-semibold text-[#292522] tabular-nums">${estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#292522] pt-3 border-t border-[#E9E3DE]">
              <span>Grand Total</span>
              <span className="tabular-nums">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E3DE] text-[11px] text-[#77716C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#89947D] shrink-0" />
            <span>This is a simulated demo checkout. No financial charges will be made.</span>
          </div>
        </div>

      </form>

    </div>
  );
};
