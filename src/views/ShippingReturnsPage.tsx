'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, ShieldCheck, HelpCircle } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#C77F79] font-semibold">
          Client Care
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#292522]">
          Shipping, Exchanges & Returns
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C] max-w-md mx-auto">
          We want you to feel entirely at ease with your selections. Every piece is packed with recyclable, plastic-free materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-[#E9E3DE] space-y-2">
          <Truck className="w-5 h-5 text-[#C77F79]" />
          <h3 className="font-semibold text-sm text-[#292522]">Complimentary Shipping</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            Free carbon-neutral delivery on all orders over $75 across the domestic United States and select international studios.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#E9E3DE] space-y-2">
          <RotateCcw className="w-5 h-5 text-[#C77F79]" />
          <h3 className="font-semibold text-sm text-[#292522]">30-Day Studio Returns</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            We provide pre-paid return shipping labels within 30 days of delivery for all undamaged items in original packaging.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-[#E9E3DE] space-y-2">
          <ShieldCheck className="w-5 h-5 text-[#89947D]" />
          <h3 className="font-semibold text-sm text-[#292522]">Breakage Guarantee</h3>
          <p className="text-xs text-[#77716C] leading-relaxed">
            If any delicate ceramic or glass piece arrives damaged during transit, we replace it immediately at zero cost.
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E3DE] text-xs text-[#77716C]">
        <h2 className="text-base font-bold text-[#292522]">Frequently Asked Questions</h2>
        
        <div className="space-y-4 divide-y divide-[#E9E3DE]">
          <div className="pt-3">
            <h4 className="font-semibold text-[#292522] text-xs mb-1">How long does shipping take?</h4>
            <p>Standard delivery takes 3–5 business days. Expedited delivery arrives within 1–2 business days via FedEx Air.</p>
          </div>

          <div className="pt-3">
            <h4 className="font-semibold text-[#292522] text-xs mb-1">What is your packaging made of?</h4>
            <p>We use 100% recyclable corrugated board, shredded kraft paper, and biodegradable water-soluble packing peanuts.</p>
          </div>

          <div className="pt-3">
            <h4 className="font-semibold text-[#292522] text-xs mb-1">How do I initiate an exchange?</h4>
            <p>Simply email <span className="text-[#292522] font-medium">concierge@mistybliss.com</span> with your order number and requested replacement piece.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-[#292522] hover:bg-[#3D3834] text-white text-xs font-semibold rounded-md transition-colors"
        >
          Return to Décor Catalog
        </Link>
      </div>
    </div>
  );
};
