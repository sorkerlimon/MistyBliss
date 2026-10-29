'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useShop } from '../../context/ShopContext';
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
const NEWSLETTER_RATE_KEY = 'misty_bliss_newsletter_last_submit';

export const Footer: React.FC = () => {
  const { addToast, rooms } = useShop();
  const [footerEmail, setFooterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formStartedAt, setFormStartedAt] = useState(0);
  const [currency, setCurrency] = useState('BDT');
  // Avoid hydration mismatch when password managers inject DOM into the email field
  const [newsletterReady, setNewsletterReady] = useState(false);
  useEffect(() => {
    setNewsletterReady(true);
    setFormStartedAt(Date.now());
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError('');

    const email = footerEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setSubscribeError('Please enter a valid email address.');
      return;
    }

    // Client-side 1/minute guard for clearer UX
    try {
      const last = Number(localStorage.getItem(NEWSLETTER_RATE_KEY) || 0);
      const elapsed = Date.now() - last;
      if (last && elapsed < 60_000) {
        const waitSec = Math.ceil((60_000 - elapsed) / 1000);
        const msg = `Please wait ${waitSec} second${waitSec === 1 ? '' : 's'} before trying again. Only one signup per minute.`;
        setSubscribeError(msg);
        addToast('Slow down a moment', msg, 'info');
        return;
      }
    } catch {
      /* ignore storage */
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'footer-subscription',
          company: honeypot,
          formStartedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 429 || data.code === 'rate_limited') {
        const msg =
          data.message ||
          'Please wait a minute before subscribing again. Only one request per minute is allowed.';
        setSubscribeError(msg);
        addToast('Too many attempts', msg, 'info');
        return;
      }

      if (!res.ok || !data.success) {
        const msg = data.message || 'Could not subscribe right now. Please try again.';
        setSubscribeError(msg);
        addToast('Subscription failed', msg, 'info');
        return;
      }

      try {
        localStorage.setItem(NEWSLETTER_RATE_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      setIsSubscribed(true);
      setFooterEmail('');
      addToast(
        'Subscribed to Studio Journal',
        data.message || 'Welcome to Misty Bliss. 10% code applied to your next purchase.'
      );
    } catch {
      setSubscribeError('Network error. Please check your connection and try again.');
      addToast('Network error', 'Please try again in a moment.', 'info');
    } finally {
      setIsSubmitting(false);
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
      
      {/* Top Banner: Modern Value Propositions (2x2 grid on mobile, 4 cols on desktop) */}
      <div className="border-b border-[#38332E]/80 bg-[#1D1A18]/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs">
            
            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#C77F79] shrink-0 border border-[#443E38]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight text-[11px] sm:text-xs">Free Express Shipping</h4>
                <p className="text-[#A89F97] mt-0.5 text-[10px] sm:text-[11px] leading-relaxed">
                  On orders over $75.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#C77F79] shrink-0 border border-[#443E38]">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight text-[11px] sm:text-xs">30-Day Returns</h4>
                <p className="text-[#A89F97] mt-0.5 text-[10px] sm:text-[11px] leading-relaxed">
                  Pre-paid printable return labels.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#89947D] shrink-0 border border-[#443E38]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight text-[11px] sm:text-xs">Natural Materials</h4>
                <p className="text-[#A89F97] mt-0.5 text-[10px] sm:text-[11px] leading-relaxed">
                  Travertine, ceramics & linen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2F2B27] flex items-center justify-center text-[#C77F79] shrink-0 border border-[#443E38]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-white tracking-tight text-[11px] sm:text-xs">Plastic-Free Packaging</h4>
                <p className="text-[#A89F97] mt-0.5 text-[10px] sm:text-[11px] leading-relaxed">
                  100% biodegradable materials.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Column 1: Brand, Mission & Socials (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            {/* Logo Lockup with Icon */}
            <Link href="/" className="flex items-center gap-3 group">
              <MistyBlissIcon size={36} className="ring-1 ring-white/20" />
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#C77F79] transition-colors">
                Misty Bliss
              </span>
            </Link>

            <p className="text-xs text-[#A89F97] leading-relaxed max-w-sm">
              Contemporary home décor, ceramics, and botanical arrangements curated for quiet beauty and tactile warmth in everyday living spaces.
            </p>

            {/* Social Icons Strip */}
            <div className="pt-1">
              <span className="text-[11px] uppercase tracking-wider text-[#77716C] font-semibold block mb-2.5">
                Follow Our Studio
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#2F2B27] border border-[#443E38] text-[#C4BBB4] hover:text-[#C77F79] hover:border-[#C77F79]/50 hover:bg-[#38332E] flex items-center justify-center transition-all duration-200"
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

          {/* TWO COLUMNS IN A SINGLE ROW ON MOBILE: Shop Collections + Curated Spaces */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-6 py-2 border-y border-[#38332E]/60 lg:border-none">
            
            {/* Mobile Column 1: Shop Collections */}
            <div className="space-y-3 text-xs">
              <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] pb-1 border-b border-[#38332E]/60 sm:border-none">
                Shop Collections
              </h5>
              <ul className="space-y-2 text-[#C4BBB4]">
                <li>
                  <Link href="/shop" className="hover:text-white transition-colors block py-0.5">
                    All Home Décor
                  </Link>
                </li>
                <li>
                  <Link href="/shop?new=true" className="hover:text-white transition-colors flex items-center gap-1 py-0.5">
                    <span>New Arrivals</span>
                    <span className="text-[9px] bg-[#C77F79]/20 text-[#E8C5BE] px-1 py-0.2 rounded font-semibold">New</span>
                  </Link>
                </li>
                <li>
                  <Link href="/shop?bestseller=true" className="hover:text-white transition-colors block py-0.5">
                    Bestsellers
                  </Link>
                </li>
                <li>
                  <Link href="/shop?sale=true" className="text-[#E8C5BE] hover:underline font-medium block py-0.5">
                    Special Offers & Sale
                  </Link>
                </li>
                <li>
                  <Link href="/categories/vases-ceramics" className="hover:text-white transition-colors block py-0.5">
                    Vases & Ceramics
                  </Link>
                </li>
                <li>
                  <Link href="/categories/artificial-flowers" className="hover:text-white transition-colors block py-0.5">
                    Botanical Florals
                  </Link>
                </li>
                <li>
                  <Link href="/categories/lighting" className="hover:text-white transition-colors block py-0.5">
                    Ambient Lighting
                  </Link>
                </li>
                <li>
                  <Link href="/categories/gifts" className="hover:text-white transition-colors block py-0.5">
                    Curated Gift Sets
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile Column 2: Curated Spaces & Info */}
            <div className="space-y-3 text-xs">
              <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] pb-1 border-b border-[#38332E]/60 sm:border-none">
                Curated Spaces
              </h5>
              <ul className="space-y-2 text-[#C4BBB4]">
                {rooms.map((room) => (
                  <li key={room.slug}>
                    <Link
                      href={`/collections/${room.slug}`}
                      className="hover:text-white transition-colors block py-0.5"
                    >
                      {room.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-1.5 border-t border-[#38332E]/60">
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors flex items-center gap-1 text-[#A89F97] py-0.5"
                  >
                    <span>Our Sourcing Story</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors text-[#A89F97] block py-0.5"
                  >
                    Sustainability Promise
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Column 3: Customer Care & Interactive Newsletter (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-2.5 text-xs">
              <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                Client Concierge
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[#C4BBB4]">
                <Link href="/shipping-returns" className="hover:text-white transition-colors text-left py-0.5">
                  Shipping Policy
                </Link>
                <Link href="/shipping-returns" className="hover:text-white transition-colors text-left py-0.5">
                  30-Day Returns
                </Link>
                <Link href="/shipping-returns" className="hover:text-white transition-colors text-left py-0.5">
                  Order Tracking
                </Link>
                <Link href="/contact" className="hover:text-white transition-colors text-left py-0.5">
                  Contact Support
                </Link>
                <Link href="/shipping-returns" className="hover:text-white transition-colors text-left py-0.5">
                  Care Guidelines
                </Link>
                <Link href="/about" className="hover:text-white transition-colors text-left py-0.5">
                  Showroom Visits
                </Link>
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
              ) : !newsletterReady ? (
                <div className="flex gap-2 h-[34px]" aria-hidden />
              ) : (
                <div className="space-y-2">
                  <form onSubmit={handleSubscribe} className="flex gap-2" noValidate>
                    {/* Honeypot — leave empty; bots often fill this */}
                    <input
                      type="text"
                      name="company"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Enter email address"
                      value={footerEmail}
                      onChange={(e) => {
                        setFooterEmail(e.target.value);
                        if (subscribeError) setSubscribeError('');
                      }}
                      autoComplete="email"
                      data-lpignore="true"
                      data-1p-ignore
                      data-form-type="other"
                      disabled={isSubmitting}
                      className="flex-1 px-3 py-2 text-xs bg-[#1F1C1A] border border-[#443E38] rounded-md text-white placeholder:text-[#77716C] focus:outline-none focus:border-[#C77F79] disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#F1E5E1] disabled:opacity-60 text-[#292522] rounded-md text-xs font-semibold transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                      aria-label="Subscribe to newsletter"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                  {subscribeError && (
                    <p className="text-[11px] text-[#E8C5BE] leading-snug" role="alert">
                      {subscribeError}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Strip: Region, Developer credit and legal */}
        <div className="pt-8 mt-8 border-t border-[#38332E] flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-[#8C837B]">
          
          {/* Region: Bangladesh Only */}
          <div className="flex items-center gap-2 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-[#A89F97]" />
            <span>Region:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#2C2723] border border-[#443E38] text-white px-2.5 py-1 rounded text-[11px] focus:outline-none focus:border-[#C77F79]"
            >
              <option value="BDT">Bangladesh (BDT ৳)</option>
            </select>
          </div>

          {/* Developer Credit */}
          <div className="text-[11px] text-[#A89F97] flex items-center gap-1.5">
            <span>Developer:</span>
            <a
              href="https://www.facebook.com/sorkerlimon21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C77F79] hover:text-[#E8C5BE] font-semibold underline underline-offset-2 transition-colors"
            >
              Limon
            </a>
          </div>

          {/* Legal & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} Misty Bliss Home Décor.</p>
            <div className="flex items-center gap-3">
              <Link href="/shipping-returns" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span>·</span>
              <Link href="/shipping-returns" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span>·</span>
              <Link href="/about" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>

        </div>

      </div>

    </footer>
  );
};
