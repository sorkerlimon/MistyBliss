import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { Truck, RotateCcw, HelpCircle, ChevronDown, Check } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are your ceramic vessels and vases suitable for holding water?',
      a: 'All our vases labeled as glazed stoneware have fully waterproof glazed interiors capable of holding fresh floral water indefinitely. For pieces designated as raw terracotta or unglazed decorative vessels, we suggest placing a dry floral arrangement or using a glass insert liner.',
    },
    {
      q: 'How are fragile lighting and stone trays protected during shipment?',
      a: 'Each item is packaged with custom-molded biodegradable corrugated cardboard and heavy-density shock-absorbing paper wrap, passing 1.5-meter drop tests before release.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 30-day return window from the day of delivery. If a piece does not suit your room aesthetic or scale, contact our team to obtain a pre-paid return shipping label. Returned items must be in undamaged original condition and packaging.',
    },
    {
      q: 'How long does standard delivery take?',
      a: 'Orders are dispatched within 24–48 hours from our Oregon facility. Standard carbon-neutral delivery takes 3–5 business days within the continental United States. Free delivery is applied automatically to all carts exceeding $75.',
    },
    {
      q: 'How do I care for Belgian washed linen cushions?',
      a: 'All our linen cushions feature hidden concealed zippers. You can remove the outer cover and machine wash on a delicate cold cycle with gentle detergent, then tumble dry on low or line dry in the shade.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C77F79]">
          Client Care & Policies
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#292522]">
          Shipping, Returns & FAQs
        </h1>
        <p className="text-xs sm:text-sm text-[#77716C] max-w-lg mx-auto">
          Everything you need to know about our packaging standards, delivery transit times, and return guarantees.
        </p>
      </div>

      {/* Two cards: Shipping & Returns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-3 text-xs">
          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C77F79] border border-[#E9E3DE]">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-semibold text-[#292522]">Complimentary Shipping</h2>
          <ul className="text-[#77716C] space-y-2 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#89947D] shrink-0 mt-0.5" />
              <span>Free standard delivery on all orders over $75 across the USA.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#89947D] shrink-0 mt-0.5" />
              <span>Standard flat-rate shipping of $8.50 for smaller orders.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#89947D] shrink-0 mt-0.5" />
              <span>Real-time tracking notifications delivered directly via email and SMS.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E9E3DE] space-y-3 text-xs">
          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#89947D] border border-[#E9E3DE]">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-semibold text-[#292522]">30-Day Effortless Returns</h2>
          <ul className="text-[#77716C] space-y-2 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#89947D] shrink-0 mt-0.5" />
              <span>Inspect items in your home lighting with full peace of mind.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#89947D] shrink-0 mt-0.5" />
              <span>Pre-paid printable return labels provided upon email request.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#89947D] shrink-0 mt-0.5" />
              <span>Refund processed within 48 hours of warehouse scan.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E9E3DE] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E9E3DE]">
          <HelpCircle className="w-4 h-4 text-[#C77F79]" />
          <h2 className="text-sm font-semibold text-[#292522] uppercase tracking-wider">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-[#E9E3DE]">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-xs font-semibold text-[#292522] text-left gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#77716C] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-[#77716C] leading-relaxed pl-0.5">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Need more help CTA */}
      <div className="text-center pt-4">
        <p className="text-xs text-[#77716C] mb-2">Have a specific question about your space?</p>
        <button
          onClick={() => navigate('/contact')}
          className="px-5 py-2 bg-[#292522] text-white text-xs font-semibold rounded-md hover:bg-[#3D3834] transition-colors"
        >
          Contact Support Team
        </button>
      </div>

    </div>
  );
};
