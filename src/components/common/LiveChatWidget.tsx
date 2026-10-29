'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Package,
  Clock,
  CheckCheck,
  ChevronDown,
  Phone,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Search,
  Tag,
  Star,
} from 'lucide-react';
import { MistyBlissIcon } from './MistyBlissIcon';
import { useShop } from '../../context/ShopContext';
import { useRouter } from '../../context/RouterContext';
import { Product } from '../../types';

interface ChatProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  material: string;
  category: string;
  rating: number;
}

interface ChatMessage {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  time: string;
  products?: ChatProductCard[];
  actions?: {
    label: string;
    actionType: 'whatsapp' | 'link' | 'chip';
    target?: string;
  }[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'concierge',
    text: 'Hello! Welcome to Misty Bliss Studio 🌿',
    time: 'Just now',
  },
  {
    id: 'msg-2',
    sender: 'concierge',
    text: 'I am your AI Design Concierge. Ask me to search our artisanal ceramics, lighting, botanicals, or check order delivery and styling advice!',
    time: 'Just now',
  },
];

const QUICK_PROMPTS = [
  { label: '🔍 Search Vases & Ceramics', query: 'Show me vases and ceramics' },
  { label: '💡 Ambient Lighting', query: 'Show me lamps and lighting' },
  { label: '🕯️ Candles & Diffusers', query: 'Search candles and home fragrance' },
  { label: '✨ Top Bestsellers', query: 'What are your top bestsellers?' },
  { label: '🎁 Gift ideas under $75', query: 'Recommend gift ideas under $75' },
  { label: '📦 Track order', query: 'Can you help me track my order?' },
  { label: '💬 Chat on WhatsApp', query: 'I would like to chat directly on WhatsApp' },
];

export const LiveChatWidget: React.FC = () => {
  const { products } = useShop();
  const { navigate } = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // WhatsApp configuration
  const whatsappNumber = '15035550192'; // Misty Bliss Studio Concierge line
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hi Misty Bliss Concierge, I would like to inquire about home décor items.'
  )}`;

  // Dismiss tooltip after 9 seconds if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setShowTooltip(false);
      setHasInteracted(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleProductClick = (slug: string) => {
    navigate(`/products/${slug}`);
    setIsOpen(false);
  };

  // Product catalog search engine inside the AI Chatbot
  const searchCatalog = (userQuery: string): Product[] => {
    const q = userQuery.toLowerCase();
    const tokens = q
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => !['show', 'me', 'i', 'want', 'search', 'for', 'find', 'the', 'a', 'an', 'do', 'you', 'have', 'recommend', 'items', 'products'].includes(w));

    // Handle price filters if present
    let maxPrice: number | null = null;
    const priceMatch = q.match(/under\s*\$?(\d+)/i) || q.match(/less\s*than\s*\$?(\d+)/i);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    // Handle bestsellers/featured
    const wantsBestsellers = q.includes('bestseller') || q.includes('popular') || q.includes('top');
    const wantsSale = q.includes('sale') || q.includes('discount') || q.includes('offer');
    const wantsNew = q.includes('new') || q.includes('latest') || q.includes('arrival');

    return products
      .filter((product) => {
        if (maxPrice !== null && product.price > maxPrice) return false;
        if (wantsSale && (!product.compareAtPrice || product.compareAtPrice <= product.price)) return false;
        if (wantsBestsellers && !product.isBestseller) return false;
        if (wantsNew && !product.isNew) return false;

        if (tokens.length === 0) return true;

        const productSearchStr = [
          product.name,
          product.description,
          product.material,
          product.categorySlug,
          ...product.collectionSlugs,
          ...product.roomTypes,
        ].join(' ').toLowerCase();

        return tokens.some((token) => productSearchStr.includes(token));
      })
      .slice(0, 3);
  };

  const handleSendMessage = (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // AI Concierge automated contextual response & product search
    setTimeout(() => {
      setIsTyping(false);
      const lower = messageContent.toLowerCase();
      let replyText = '';
      let actions: ChatMessage['actions'] = undefined;
      let matchedProducts: ChatProductCard[] | undefined = undefined;

      const isSearchIntent =
        lower.includes('search') ||
        lower.includes('show') ||
        lower.includes('find') ||
        lower.includes('recommend') ||
        lower.includes('vase') ||
        lower.includes('ceramic') ||
        lower.includes('lamp') ||
        lower.includes('light') ||
        lower.includes('candle') ||
        lower.includes('botanical') ||
        lower.includes('flower') ||
        lower.includes('linen') ||
        lower.includes('cushion') ||
        lower.includes('pillow') ||
        lower.includes('tray') ||
        lower.includes('planter') ||
        lower.includes('gift') ||
        lower.includes('bestseller') ||
        lower.includes('stoneware') ||
        lower.includes('terracotta') ||
        lower.includes('under $') ||
        lower.includes('under');

      if (isSearchIntent) {
        const found = searchCatalog(messageContent);
        if (found.length > 0) {
          replyText = `Here are curated items from our studio collection that match "${messageContent}":`;
          matchedProducts = found.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            image: p.images[0],
            material: p.material,
            category: p.categorySlug.replace('-', ' '),
            rating: p.rating,
          }));
          actions = [
            {
              label: 'Explore Full Search Catalog',
              actionType: 'link',
              target: `/search?q=${encodeURIComponent(messageContent)}`,
            },
            {
              label: 'Chat with Stylist on WhatsApp',
              actionType: 'whatsapp',
              target: whatsappUrl,
            },
          ];
        } else {
          replyText = `I couldn't find exact matches for "${messageContent}". Would you like to browse our full search directory or view our bestsellers?`;
          actions = [
            {
              label: 'Search Catalog',
              actionType: 'link',
              target: `/search?q=${encodeURIComponent(messageContent)}`,
            },
            {
              label: 'View Bestsellers',
              actionType: 'link',
              target: '/shop?bestseller=true',
            },
          ];
        }
      } else if (lower.includes('whatsapp') || lower.includes('phone') || lower.includes('call')) {
        replyText =
          'You can connect directly with our studio team on WhatsApp right now for real-time photo consultations, custom orders, and immediate styling assistance:';
        actions = [
          {
            label: 'Open WhatsApp Chat 💬',
            actionType: 'whatsapp',
            target: whatsappUrl,
          },
        ];
      } else if (lower.includes('track') || lower.includes('order') || lower.includes('status')) {
        replyText =
          'To track your order, please check your dispatch email with courier tracking number, or visit our Shipping & Order Tracking page:';
        actions = [
          {
            label: 'Go to Order Tracking',
            actionType: 'link',
            target: '/shipping-returns',
          },
        ];
      } else if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('cost')) {
        replyText =
          'We offer complimentary Express Courier Shipping on all orders over $75. Standard domestic delivery typically arrives within 2–4 business days with carbon-neutral, plastic-free packaging.';
        actions = [
          {
            label: 'View Shipping Policy',
            actionType: 'link',
            target: '/shipping-returns',
          },
        ];
      } else if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) {
        replyText =
          'We provide 30-day hassle-free returns. Simply contact our concierge or generate a prepaid label via the Shipping & Returns portal.';
        actions = [
          {
            label: 'Returns & Exchange Policy',
            actionType: 'link',
            target: '/shipping-returns',
          },
        ];
      } else {
        replyText =
          'Thank you for reaching out! You can search our artisanal pieces, check shipping, or speak directly with our styling concierge on WhatsApp.';
        actions = [
          {
            label: 'Search All Products 🔍',
            actionType: 'link',
            target: '/search',
          },
          {
            label: 'Continue on WhatsApp',
            actionType: 'whatsapp',
            target: whatsappUrl,
          },
        ];
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'concierge',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: matchedProducts,
        actions,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end pointer-events-auto">
      {/* CHAT WINDOW POPOVER */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Misty Bliss Live Chat Concierge"
          className="w-[calc(100vw-2.5rem)] sm:w-[410px] h-[550px] max-h-[85vh] bg-[#FAF8F5] rounded-2xl shadow-[0_20px_50px_rgba(41,37,34,0.22)] border border-[#E9E3DE] flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* HEADER: Styled with Brand Color #C77F79 */}
          <div className="bg-[#C77F79] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-sm relative">
            <div className="flex items-center gap-3">
              {/* Concierge Avatar with Live Indicator */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white">
                  <MistyBlissIcon size={22} variant="light" />
                </div>
                {/* Active Green Dot */}
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#C77F79] rounded-full"
                  title="Online now"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-semibold text-sm tracking-tight text-white leading-tight">
                    Misty Bliss AI Concierge
                  </h3>
                  <span className="text-[10px] bg-white/20 text-white font-medium px-1.5 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-white/90 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse inline-block" />
                  Product search & styling assistance
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              {/* WhatsApp Quick Direct Jump */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open WhatsApp directly"
                className="p-1.5 rounded-lg text-white/85 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Direct WhatsApp link"
              >
                <Phone className="w-4 h-4" />
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/85 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Close live chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WHATSAPP QUICK BANNER */}
          <div className="bg-[#F1E5E1] border-b border-[#E8D4CF] px-3.5 py-2 flex items-center justify-between text-xs text-[#292522]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C77F79]" />
              <span className="font-medium text-[11px] text-[#4A443F]">
                Instant support or photo styling?
              </span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C77F79] hover:text-[#A65B55] hover:underline"
            >
              <span>WhatsApp Us</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]">
            {/* Timestamp divider */}
            <div className="flex justify-center my-1">
              <span className="text-[10px] uppercase tracking-wider text-[#A89F97] bg-[#F1ECE6] px-2.5 py-0.5 rounded-full">
                Today
              </span>
            </div>

            {messages.map((msg) => {
              const isConcierge = msg.sender === 'concierge';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isConcierge ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                      isConcierge
                        ? 'bg-white text-[#292522] border border-[#EBE5DE] rounded-tl-xs'
                        : 'bg-[#C77F79] text-white rounded-tr-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Interactive Product Mini-Cards rendered directly in Chatbot */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[#EBE5DE] pt-2.5">
                        {msg.products.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-[#FAF8F5] border border-[#E9E3DE] rounded-xl p-2 flex items-center gap-2.5 hover:border-[#C77F79] transition-all group"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover border border-[#E0D7D0] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-semibold text-[#292522] truncate group-hover:text-[#C77F79]">
                                {prod.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-[#77716C]">
                                <span>{prod.material}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  {prod.rating}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-bold text-[#292522]">
                                  ${prod.price}
                                </span>
                                {prod.compareAtPrice && (
                                  <span className="text-[10px] text-[#A89F97] line-through">
                                    ${prod.compareAtPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleProductClick(prod.slug)}
                              className="px-2.5 py-1.5 bg-[#C77F79] hover:bg-[#B56F69] text-white text-[10px] font-semibold rounded-md shrink-0 transition-colors cursor-pointer shadow-2xs"
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons embedded in message */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-black/5 flex flex-col gap-1.5">
                        {msg.actions.map((action, idx) => {
                          if (action.actionType === 'whatsapp' && action.target) {
                            return (
                              <a
                                key={idx}
                                href={action.target}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#C77F79] text-white rounded-lg font-medium text-[11px] hover:bg-[#B56F69] transition-colors shadow-xs"
                              >
                                <span>{action.label}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            );
                          }
                          if (action.actionType === 'link' && action.target) {
                            return (
                              <Link
                                key={idx}
                                href={action.target}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center justify-between px-3 py-1.5 bg-[#FAF8F5] text-[#292522] border border-[#E0D7D0] rounded-lg font-medium text-[11px] hover:bg-[#F3ECE5] transition-colors"
                              >
                                <span>{action.label}</span>
                                <ArrowRight className="w-3 h-3 text-[#C77F79]" />
                              </Link>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Message meta */}
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-[#A89F97]">{msg.time}</span>
                    {!isConcierge && (
                      <CheckCheck className="w-3.5 h-3.5 text-[#C77F79]" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-[#EBE5DE] rounded-2xl rounded-tl-xs px-3.5 py-2.5 w-fit shadow-xs">
                <span className="w-1.5 h-1.5 bg-[#C77F79] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#C77F79] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#C77F79] rounded-full animate-bounce" />
                <span className="text-[10px] text-[#77716C] ml-1">Concierge searching products...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="px-3 py-2 bg-[#F6F2ED] border-t border-[#EAE3DC] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt.query)}
                className="shrink-0 text-[11px] bg-white text-[#4A443F] hover:text-[#C77F79] hover:border-[#C77F79] px-2.5 py-1 rounded-full border border-[#DFD7CF] transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-white border-t border-[#EBE5DE] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, ceramics, lighting, tracking..."
                className="flex-1 bg-[#FAF8F5] border border-[#E4DDD5] rounded-full px-3.5 py-2 text-xs text-[#292522] placeholder:text-[#A89F97] focus:outline-hidden focus:ring-1 focus:ring-[#C77F79] focus:border-[#C77F79] transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                aria-label="Send message"
                className="w-8 h-8 rounded-full bg-[#C77F79] hover:bg-[#B56F69] disabled:opacity-40 disabled:hover:bg-[#C77F79] text-white flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-[#A89F97]">
              <span>Misty Bliss Concierge Studio</span>
              <span>Available Mon–Sat</span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING ACTION TRIGGER BUTTON (WHATSAPP-STYLE WITH BRAND COLOR #C77F79) */}
      <div className="flex items-center gap-2.5">
        {/* Floating Tooltip Pill */}
        {showTooltip && !isOpen && (
          <div
            onClick={handleToggle}
            className="cursor-pointer bg-white text-[#292522] px-3.5 py-2 rounded-full shadow-[0_6px_20px_rgba(41,37,34,0.12)] border border-[#EAE3DC] text-xs font-medium flex items-center gap-2 hover:bg-[#FAF8F5] transition-all animate-in fade-in slide-in-from-right-3 duration-300"
          >
            <span className="w-2 h-2 rounded-full bg-[#C77F79] shrink-0 animate-ping" />
            <span className="text-[11px] sm:text-xs">Search products or chat live</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-[#A89F97] hover:text-[#292522] ml-0.5 cursor-pointer"
              aria-label="Dismiss chat tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* The Round Floating Chat Button */}
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isOpen ? 'Close live chat' : 'Open live chat'}
          aria-expanded={isOpen}
          className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C77F79] hover:bg-[#B56F69] active:bg-[#9E5D57] text-white shadow-[0_10px_30px_rgba(199,127,121,0.45)] hover:shadow-[0_14px_35px_rgba(199,127,121,0.55)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-[#C77F79]/30"
        >
          {/* Subtle radiating pulse ring */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#C77F79] opacity-35 animate-ping -z-10" />
          )}

          {/* Active online green badge dot */}
          {!isOpen && (
            <span
              className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"
              title="Online"
            />
          )}

          {/* Notification count badge if unread */}
          {!isOpen && unreadCount > 0 && !hasInteracted && (
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-[#292522] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {unreadCount}
            </span>
          )}

          {/* Main Icon: MessageCircle (WhatsApp / Live chat style) or X when open */}
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 rotate-0 hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white/10 stroke-[2] transition-transform duration-200 group-hover:scale-110" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
