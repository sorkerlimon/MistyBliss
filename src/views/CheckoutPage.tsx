'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from '../context/RouterContext';
import { useShop } from '../context/ShopContext';
import { ProductImage } from '../components/common/ProductImage';
import { CheckCircle2, ShieldCheck, Truck, Lock, ShoppingBag, Banknote, CreditCard, WalletCards } from 'lucide-react';
import { Money } from '../components/common/Money';
import { Turnstile, useTurnstileToken, verifyTurnstile } from '../components/common/Turnstile';

export const CheckoutPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    cart,
    cartSubtotal,
    promoDiscount,
    discountAmount,
    shopSettings,
    clearCart,
    getProductById,
    createOrder,
    resetDemoCart,
  } = useShop();

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const shippingSpeed = 'standard' as const;
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'bkash'>('cod');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const {
    setToken: setTurnstileToken,
    widgetKey,
    reset: resetTurnstile,
    obtainToken,
    controllerRef: turnstileControllerRef,
  } = useTurnstileToken();

  const activeZones = useMemo(
    () => shopSettings.deliveryZones.filter((z) => z.active),
    [shopSettings.deliveryZones]
  );

  useEffect(() => {
    if (!shopSettings.deliveryEnabled) {
      setSelectedZoneId('');
      return;
    }
    if (!selectedZoneId || !activeZones.some((z) => z.id === selectedZoneId)) {
      setSelectedZoneId(activeZones[0]?.id || '');
    }
  }, [shopSettings.deliveryEnabled, activeZones, selectedZoneId]);

  const selectedZone = activeZones.find((z) => z.id === selectedZoneId);
  const selectedShippingCost =
    shopSettings.deliveryEnabled && selectedZone ? selectedZone.fee : 0;
  const estimatedTax = shopSettings.taxEnabled
    ? Math.round(cartSubtotal * (shopSettings.taxPercent / 100) * 100) / 100
    : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + selectedShippingCost + estimatedTax);
  const isCheckoutReady =
    email.trim().includes('@') &&
    [firstName, lastName, address, city, state, postalCode, phone].every((value) => value.trim()) &&
    acceptedTerms &&
    (!shopSettings.deliveryEnabled || Boolean(selectedZoneId));

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
    if (shopSettings.deliveryEnabled && !selectedZoneId) {
      errors.deliveryZone = 'Please select a delivery area';
    }
    if (!acceptedTerms) errors.terms = 'Please agree to the terms before confirming your order';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let token: string | null = null;
    try {
      token = (await obtainToken()) || null;
    } catch (err) {
      setFormErrors((errors) => ({
        ...errors,
        turnstile: err instanceof Error ? err.message : 'Please complete the security check.',
      }));
      resetTurnstile();
      setIsSubmitting(false);
      return;
    }
    const turnstileError = await verifyTurnstile(token);
    if (turnstileError) {
      setFormErrors((errors) => ({ ...errors, turnstile: turnstileError }));
      resetTurnstile();
      setIsSubmitting(false);
      return;
    }

    const orderItems = cart.map((i) => {
      const prod = getProductById(i.productId);
      return {
        productId: i.productId,
        name: prod?.name || 'Home Decor Item',
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
      notes: selectedZone
        ? `Delivery zone: ${selectedZone.name}${shopSettings.taxEnabled ? ` · Tax ${shopSettings.taxPercent}%` : ''}`
        : shopSettings.taxEnabled
          ? `Tax ${shopSettings.taxPercent}%`
          : undefined,
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
      deliveryZone: selectedZone?.name,
      shippingFee: selectedShippingCost,
      tax: estimatedTax,
    };

    setOrderConfirmed(confirmedOrder);
    clearCart();
    resetTurnstile();
    setIsSubmitting(false);
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
            Your order <span className="font-semibold text-[#292522]">#{orderConfirmed.orderNumber}</span> has been confirmed. A confirmation receipt has been sent to <span className="text-[#292522] font-medium">{email}</span>.
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
                    <Money amount={(item.product?.price || 0) * item.quantity} />
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E9E3DE] flex justify-between items-center text-sm font-bold text-[#292522]">
              <span>Total Paid</span>
              <span className="tabular-nums"><Money amount={orderConfirmed.total} className="font-bold" /></span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-8 py-3 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Return to Storefront
            </button>
            <a
              href="https://www.facebook.com/sorkerlimon21"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#E9E3DE] hover:border-[#292522] text-[#292522] text-xs font-semibold rounded-md transition-colors text-center inline-flex items-center justify-center gap-1.5"
            >
              <span>Developer:</span>
              <span className="font-bold text-[#C77F79] hover:underline">Limon</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F1E5E1] flex items-center justify-center text-[#C77F79]">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#292522]">Your bag is currently empty</h2>
        <p className="text-xs text-[#77716C] max-w-sm mx-auto leading-relaxed">
          Add artisanal pieces from our catalog, or click below to populate sample items and test the checkout flow.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={resetDemoCart}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#C77F79] hover:bg-[#b56e68] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
          >
            Load Sample Items to Checkout
          </button>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors text-center cursor-pointer shadow-xs"
          >
            Explore Decor Catalog
          </Link>
        </div>
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
        <span className="text-[#292522] font-medium">Checkout</span>
      </nav>

      <div className="flex items-center gap-2 pb-2 border-b border-[#E9E3DE]">
        <Lock className="w-4 h-4 text-[#89947D]" />
        <h1 className="text-xl sm:text-2xl font-bold text-[#292522]">
          Secure Checkout
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
                  placeholder="e.g. +880 1700-000000"
                />
                {formErrors.phone && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.phone}</p>}
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
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                    formErrors.firstName ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                  }`}
                  placeholder="First name"
                />
                {formErrors.firstName && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                    formErrors.lastName ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                  }`}
                  placeholder="Last name"
                />
                {formErrors.lastName && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.lastName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                    formErrors.address ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                  }`}
                  placeholder="House number and street name"
                />
                {formErrors.address && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.address}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">Apartment, Suite, Unit (Optional)</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E9E3DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79]"
                  placeholder="Apartment, suite, unit, etc."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#77716C] mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                    formErrors.city ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                  }`}
                  placeholder="City"
                />
                {formErrors.city && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.city}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">State / Division *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                      formErrors.state ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                    }`}
                    placeholder="State or Division"
                  />
                  {formErrors.state && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.state}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#77716C] mb-1">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C77F79] ${
                      formErrors.postalCode ? 'border-[#A84940]' : 'border-[#E9E3DE]'
                    }`}
                    placeholder="Postal Code"
                  />
                  {formErrors.postalCode && <p className="text-[10px] text-[#A84940] mt-0.5">{formErrors.postalCode}</p>}
                </div>
              </div>
            </div>
          </div>

          {shopSettings.deliveryEnabled && (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E9E3DE] space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#292522] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#292522] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Delivery Area
              </h2>
              <div className="space-y-2">
                {activeZones.length === 0 ? (
                  <p className="text-xs text-[#A84940]">No delivery zones are active. Please contact support.</p>
                ) : (
                  activeZones.map((zone) => (
                    <label
                      key={zone.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-md border cursor-pointer ${
                        selectedZoneId === zone.id ? 'border-[#292522] bg-[#FAF8F5]' : 'border-[#E9E3DE]'
                      }`}
                    >
                      <span className="flex items-center gap-3 text-xs">
                        <input
                          type="radio"
                          name="delivery-zone"
                          checked={selectedZoneId === zone.id}
                          onChange={() => setSelectedZoneId(zone.id)}
                          className="accent-[#292522]"
                        />
                        <span className="font-semibold text-[#292522]">{zone.name}</span>
                      </span>
                      <span className="text-xs font-semibold text-[#292522] tabular-nums">
                        {zone.fee === 0 ? (
                          <span className="text-[#89947D]">FREE</span>
                        ) : (
                          <Money amount={zone.fee} />
                        )}
                      </span>
                    </label>
                  ))
                )}
                {formErrors.deliveryZone && (
                  <p className="text-[10px] text-[#A84940]">{formErrors.deliveryZone}</p>
                )}
              </div>
            </div>
          )}

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
                    <Money amount={product.price * item.quantity} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing breakdown */}
          <div className="pt-3 border-t border-[#E9E3DE] space-y-2 text-xs text-[#77716C]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#292522] tabular-nums"><Money amount={cartSubtotal} /></span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#89947D]">
                <span>Promotional Discount ({promoDiscount?.code})</span>
                <span className="font-semibold tabular-nums">−<Money amount={discountAmount} /></span>
              </div>
            )}

            {shopSettings.deliveryEnabled && (
              <div className="flex justify-between">
                <span>Delivery{selectedZone ? ` (${selectedZone.name})` : ''}</span>
                <span className="font-semibold text-[#292522] tabular-nums">
                  {selectedShippingCost === 0 ? (
                    <span className="text-[#89947D]">FREE</span>
                  ) : (
                    <Money amount={selectedShippingCost} />
                  )}
                </span>
              </div>
            )}

            {shopSettings.taxEnabled && (
              <div className="flex justify-between">
                <span>Sales Tax ({shopSettings.taxPercent}%)</span>
                <span className="font-semibold text-[#292522] tabular-nums">
                  <Money amount={estimatedTax} />
                </span>
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-[#292522] pt-3 border-t border-[#E9E3DE]">
              <span>Grand Total</span>
              <span className="tabular-nums"><Money amount={finalTotal} className="font-bold" /></span>
            </div>
          </div>

          <fieldset className="pt-1 space-y-2.5">
            <legend className="text-sm font-semibold uppercase tracking-wider text-[#292522]">Payment Method</legend>
            <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${paymentMethod === 'cod' ? 'border-[#292522] bg-[#FAF8F5]' : 'border-[#E9E3DE]'}`}>
              <input type="radio" name="payment-method" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-[#292522]" />
              <span className="w-8 h-8 rounded bg-[#FFF1C9] text-[#B77A18] flex items-center justify-center shrink-0"><Banknote className="w-4 h-4" /></span>
              <span><span className="flex items-center gap-2 font-semibold text-[#292522]">Cash on Delivery <span className="rounded bg-[#E9E3DE] px-1.5 py-0.5 text-[8px] uppercase text-[#77716C]">Popular</span></span><span className="block text-[10px] text-[#77716C] mt-0.5">Pay when your order arrives.</span></span>
            </label>
            {/* Temporarily disabled — Card Payment
            <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${paymentMethod === 'card' ? 'border-[#292522] bg-[#FAF8F5]' : 'border-[#E9E3DE]'}`}>
              <input type="radio" name="payment-method" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#292522]" />
              <span className="w-8 h-8 rounded bg-[#E3F0FF] text-[#4C85CA] flex items-center justify-center shrink-0"><CreditCard className="w-4 h-4" /></span>
              <span><span className="flex items-center gap-2 font-semibold text-[#292522]">Card Payment <span className="rounded bg-[#DDF2E6] px-1.5 py-0.5 text-[8px] uppercase text-[#4E8061]">Secure</span></span><span className="block text-[10px] text-[#77716C] mt-0.5">Visa, Mastercard, and Amex.</span></span>
            </label>
            */}
            {/* Temporarily disabled — bKash
            <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${paymentMethod === 'bkash' ? 'border-[#292522] bg-[#FAF8F5]' : 'border-[#E9E3DE]'}`}>
              <input type="radio" name="payment-method" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="accent-[#292522]" />
              <span className="w-8 h-8 rounded bg-[#FFE7EF] text-[#D12067] flex items-center justify-center shrink-0"><WalletCards className="w-4 h-4" /></span>
              <span><span className="font-semibold text-[#292522]">bKash</span><span className="block text-[10px] text-[#77716C] mt-0.5">Pay with your bKash mobile wallet.</span></span>
            </label>
            */}
          </fieldset>

          <label className="flex items-start gap-2 pt-1 text-[11px] text-[#77716C] cursor-pointer">
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => { setAcceptedTerms(e.target.checked); if (formErrors.terms) setFormErrors((errors) => ({ ...errors, terms: '' })); }} className="mt-0.5 accent-[#292522]" />
            <span>I agree to the <Link href="/shipping-returns" className="underline underline-offset-2 hover:text-[#292522]">Terms &amp; Conditions</Link>, <Link href="/shipping-returns" className="underline underline-offset-2 hover:text-[#292522]">Refund Policy</Link>, and <Link href="/shipping-returns" className="underline underline-offset-2 hover:text-[#292522]">Privacy Policy</Link>.</span>
          </label>
          {formErrors.terms && <p className="text-[10px] text-[#A84940] -mt-2">{formErrors.terms}</p>}

          <Turnstile
            key={widgetKey}
            onTokenChange={setTurnstileToken}
            controllerRef={turnstileControllerRef}
          />
          {formErrors.turnstile && (
            <p className="text-[10px] text-[#A84940]" role="alert">
              {formErrors.turnstile}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !isCheckoutReady}
            className="w-full py-3.5 px-6 bg-[#C77F79] hover:bg-[#b56e68] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-[#D4CBC4] disabled:text-white/80 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm Order · <Money amount={finalTotal} className="font-semibold text-white" /></span>
              </>
            )}
          </button>

          <div className="pt-1 text-[11px] text-[#77716C] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#89947D]" />
            <span>Secure payment · Easy returns · Fast delivery</span>
          </div>
        </div>

      </form>

    </div>
  );
};
