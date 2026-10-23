import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES, ROOMS } from '../../data/mockData';
import { MistyBlissIcon } from '../common/MistyBlissIcon';
import {
  Instagram,
  Facebook,
  Youtube,
  Send,
  Check,
  Globe,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { recordNewsletterSubscriber } from '../../lib/supabase';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { addToast } = useShop();
  const [footerEmail, setFooterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerEmail.trim() && footerEmail.includes('@')) {
      setIsSubscribed(true);
      recordNewsletterSubscriber(footerEmail, 'footer-subscription').catch(() => {});
      addToast('Subscribed to Studio Journal', 'Welcome to Misty Bliss. 10% code applied to your next purchase.');
    }
  };

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: <Instagram className="w-4 h-4" />,
      handle: '@mistyblisshome',
    },
    {
      name: 'Pinterest',
      href: 'https://pinterest.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      ),
      handle: 'mistybliss',
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.41a8.27 8.27 0 0 0 4.77 1.72V6.69z"/>
        </svg>
      ),
      handle: '@mistybliss',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: <Facebook className="w-4 h-4" />,
      handle: 'Misty Bliss Décor',
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      icon: <Youtube className="w-4 h-4" />,
      handle: 'Misty Bliss Home',
    },
  ];

  return (
    <footer className="bg-[#24211E] text-[#FAF8F5] border-t border-[#38332E] mt-20 relative overflow-hidden">
      
      {/* Top Banner: Modern Value Propositions */}
      <div className="border-b border-[#38332E]/80 bg-[#1D1A18]/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#C77F79] shrink-0 border border-[#443E38]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight">Free Express Shipping</h4>
                <p className="text-[#A89F97] mt-0.5 text-[11px] leading-relaxed">
                  Complimentary on all qualifying domestic orders over $75.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#C77F79] shrink-0 border border-[#443E38]">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight">30-Day Effortless Returns</h4>
                <p className="text-[#A89F97] mt-0.5 text-[11px] leading-relaxed">
                  Pre-paid printable return labels with full item refunds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#89947D] shrink-0 border border-[#443E38]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight">Artisanal Natural Materials</h4>
                <p className="text-[#A89F97] mt-0.5 text-[11px] leading-relaxed">
                  Solid travertine stone, grogged stoneware, and Belgian linen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#C77F79] shrink-0 border border-[#443E38]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight">Plastic-Free Packaging</h4>
                <p className="text-[#A89F97] mt-0.5 text-[11px] leading-relaxed">
                  100% biodegradable corrugated wrap tested for fragile cargo.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand, Mission & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo Lockup with Icon */}
            <div className="flex items-center gap-3">
              <MistyBlissIcon size={30} variant="light" />
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                Misty Bliss
              </span>
            </div>

            <p className="text-xs text-[#A89F97] leading-relaxed max-w-sm">
              Contemporary home décor, ceramics, and botanical arrangements curated for quiet beauty and tactile warmth in everyday living spaces.
            </p>

            {/* Social Icons Strip */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#77716C] font-semibold block mb-3">
                Follow Our Studio
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#2F2B27] border border-[#443E38] text-[#C4BBB4] hover:text-[#C77F79] hover:border-[#C77F79]/50 hover:bg-[#38332E] flex items-center justify-center transition-all duration-200"
                    aria-label={`Follow Misty Bliss on ${social.name}`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Studio location note */}
            <div className="pt-3 text-[11px] text-[#7E756D] border-t border-[#38332E]/80">
              <p>Studio Showroom & Workshop</p>
              <p className="text-[#A89F97]">418 Mercer Walk, Portland, OR</p>
            </div>
          </div>

          {/* Column 2: Shop Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-xs">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-[#C4BBB4]">
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
                  All Home Décor
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop', { new: 'true' })} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>New Arrivals</span>
                  <span className="text-[9px] bg-[#C77F79]/20 text-[#E8C5BE] px-1 py-0.2 rounded font-semibold">New</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop', { bestseller: 'true' })} className="hover:text-white transition-colors">
                  Bestsellers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop', { sale: 'true' })} className="text-[#E8C5BE] hover:underline font-medium">
                  Special Offers & Sale
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories/vases-ceramics')} className="hover:text-white transition-colors">
                  Vases & Ceramics
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories/artificial-flowers')} className="hover:text-white transition-colors">
                  Botanical Florals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories/lighting')} className="hover:text-white transition-colors">
                  Ambient Lighting
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories/gifts')} className="hover:text-white transition-colors">
                  Curated Gift Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop by Room (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5 text-xs">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Curated Spaces
            </h5>
            <ul className="space-y-2 text-[#C4BBB4]">
              {ROOMS.map((room) => (
                <li key={room.slug}>
                  <button
                    onClick={() => navigate(`/collections/${room.slug}`)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {room.name}
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-[#38332E]/60">
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-[#A89F97]"
                >
                  <span>Our Sourcing Story</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors text-[#A89F97]"
                >
                  Sustainability Promise
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Interactive Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-3 text-xs">
              <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Client Concierge
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[#C4BBB4]">
                <button onClick={() => navigate('/shipping-returns')} className="hover:text-white transition-colors text-left">
                  Shipping Policy
                </button>
                <button onClick={() => navigate('/shipping-returns')} className="hover:text-white transition-colors text-left">
                  30-Day Returns
                </button>
                <button onClick={() => navigate('/shipping-returns')} className="hover:text-white transition-colors text-left">
                  Order Tracking
                </button>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors text-left">
                  Contact Support
                </button>
                <button onClick={() => navigate('/shipping-returns')} className="hover:text-white transition-colors text-left">
                  Care Guidelines
                </button>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors text-left">
                  Showroom Visits
                </button>
              </div>
            </div>

            {/* Modern Newsletter Subscription Box */}
            <div className="p-4 rounded-xl bg-[#2C2723] border border-[#3E3832] space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-white block">
                  Join the Misty Bliss Design Circle
                </span>
                <p className="text-[11px] text-[#A89F97] mt-0.5 leading-relaxed">
                  Enjoy 10% off your initial purchase and early access to limited artisanal drops.
                </p>
              </div>

              {isSubscribed ? (
                <div className="bg-[#89947D]/15 border border-[#89947D]/40 text-[#A6B299] p-2.5 rounded-lg flex items-center gap-2 text-xs">
                  <Check className="w-4 h-4 text-[#89947D] shrink-0" />
                  <span>Welcome! Check your inbox for code WELCOME10.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-[#1F1C1A] border border-[#443E38] rounded-md text-white placeholder:text-[#77716C] focus:outline-none focus:border-[#C77F79]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#F1E5E1] text-[#292522] rounded-md text-xs font-semibold transition-colors flex items-center justify-center shrink-0"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Strip: Payment methods, currency and legal */}
        <div className="pt-10 mt-10 border-t border-[#38332E] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8C837B]">
          
          {/* Region / Currency */}
          <div className="flex items-center gap-2 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-[#A89F97]" />
            <span>Region:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#2C2723] border border-[#443E38] text-white px-2 py-1 rounded text-[11px] focus:outline-none focus:border-[#C77F79]"
            >
              <option value="USD">United States (USD $)</option>
              <option value="CAD">Canada (CAD $)</option>
              <option value="EUR">European Union (EUR €)</option>
              <option value="GBP">United Kingdom (GBP £)</option>
            </select>
          </div>

          {/* Payment Method Badges (clean SVGs) */}
          <div className="flex items-center gap-2 select-none">
            <span className="text-[10px] text-[#7E756D] mr-1 hidden sm:inline">Secure Payment:</span>
            <div className="flex items-center gap-1.5">
              {/* Visa */}
              <div className="h-6 px-2 rounded bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white tracking-wider">
                VISA
              </div>
              {/* Mastercard */}
              <div className="h-6 px-2 rounded bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white tracking-wider">
                MC
              </div>
              {/* Amex */}
              <div className="h-6 px-2 rounded bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white tracking-wider">
                AMEX
              </div>
              {/* Apple Pay */}
              <div className="h-6 px-2 rounded bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-semibold text-white">
                Pay
              </div>
              {/* PayPal */}
              <div className="h-6 px-2 rounded bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-semibold text-white">
                PayPal
              </div>
            </div>
          </div>

          {/* Legal and Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} Misty Bliss Home Décor.</p>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/shipping-returns')} className="hover:text-white transition-colors">
                Privacy
              </button>
              <span>·</span>
              <button onClick={() => navigate('/shipping-returns')} className="hover:text-white transition-colors">
                Terms
              </button>
              <span>·</span>
              <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                Accessibility
              </button>
              <span>·</span>
              <button onClick={() => navigate('/admin')} className="text-[#C77F79] hover:underline font-medium">
                Admin Portal
              </button>
            </div>
          </div>

        </div>

      </div>

    </footer>
  );
};

