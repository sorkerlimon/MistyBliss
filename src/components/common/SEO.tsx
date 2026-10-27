'use client';

import React, { useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/mockData';

export const SEO: React.FC = () => {
  const { route } = useRouter();
  const { products } = useShop();

  useEffect(() => {
    let title = 'Misty Bliss – Artisanal Home Décor & Modern Living';
    let description =
      'Discover thoughtfully curated home décor, stoneware ceramics, handcrafted lighting, botanical accents, and minimalist interior accessories at Misty Bliss.';
    let jsonLd: object | null = null;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mistybliss.com';

    switch (route.type) {
      case 'home':
        title = 'Misty Bliss – Artisanal Home Décor, Ceramics & Modern Living';
        description =
          'Shop thoughtfully curated home décor, stoneware vessels, botanical arrangements, lighting, and artisanal accessories crafted for intentional living.';
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Misty Bliss',
          url: currentUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${typeof window !== 'undefined' ? window.location.origin : ''}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };
        break;

      case 'shop':
        if (route.searchParams.sale === 'true') {
          title = 'Special Offers & Archive Sale | Misty Bliss Décor';
          description = 'Browse limited-time offers on handcrafted ceramic vessels, brass accents, and tactile linen home accessories.';
        } else if (route.searchParams.new === 'true') {
          title = 'New Spring Arrivals | Handcrafted Décor & Ceramics | Misty Bliss';
          description = 'Explore our newest collection of sculptural stoneware, fluted lighting, and sustainable interior accents.';
        } else if (route.searchParams.bestseller === 'true') {
          title = 'Customer Bestsellers | Most-Loved Home Décor | Misty Bliss';
          description = 'Discover the most cherished ceramics, candles, and decorative trays selected by modern interior enthusiasts.';
        } else {
          title = 'Shop All Home Décor & Living Accents | Misty Bliss';
          description = 'Explore the full catalog of handcrafted stoneware, warm ambient lighting, organic linen textiles, and artisanal wares.';
        }
        break;

      case 'category': {
        const cat = CATEGORIES.find((c) => c.slug === route.slug);
        const catName = cat ? cat.name : 'Category Collection';
        title = `${catName} – Artisanal Home Décor | Misty Bliss`;
        description = `Browse our handcrafted collection of ${catName.toLowerCase()}, meticulously curated with natural materials and timeless forms.`;
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: typeof window !== 'undefined' ? window.location.origin : '' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${typeof window !== 'undefined' ? window.location.origin : ''}/shop` },
            { '@type': 'ListItem', position: 3, name: catName, item: currentUrl },
          ],
        };
        break;
      }

      case 'product': {
        const prod = products.find((p) => p.slug === route.slug);
        if (prod) {
          title = `${prod.name} – Handcrafted Décor | Misty Bliss`;
          description = `${prod.name}: ${prod.description.slice(0, 140)}... Crafted with ${prod.material}. Free delivery over $75.`;
          jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: prod.name,
            image: prod.images,
            description: prod.description,
            brand: { '@type': 'Brand', name: 'Misty Bliss' },
            offers: {
              '@type': 'Offer',
              price: prod.price,
              priceCurrency: 'USD',
              availability: prod.stockStatus === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: currentUrl,
            },
          };
        }
        break;
      }

      case 'cart':
        title = 'Your Shopping Bag | Misty Bliss';
        description = 'Review your curated home décor selections, calculate shipping, and proceed to secure checkout.';
        break;

      case 'checkout':
        title = 'Secure Checkout | Misty Bliss';
        description = 'Complete your order with carbon-neutral delivery and encrypted checkout at Misty Bliss.';
        break;

      case 'wishlist':
        title = 'Your Saved Décor Wishlist | Misty Bliss';
        description = 'Keep track of your favorite ceramics, lighting, and textiles to style your home.';
        break;

      case 'about':
        title = 'Our Artisanal Philosophy & Craft Heritage | Misty Bliss';
        description = 'Learn about our dedication to sustainable materials, master ceramicists, and slow, intentional home design.';
        break;

      case 'contact':
        title = 'Contact Concierge & Customer Care | Misty Bliss';
        description = 'Get in touch with our design studio team for styling advice, trade orders, and order assistance.';
        break;

      case 'admin':
        title = 'Admin Management Portal | Misty Bliss';
        description = 'Administrative portal for managing inventory, orders, and storefront configuration.';
        break;
    }

    // Update document title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: string, key: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);

    // Set JSON-LD structured data
    let scriptTag = document.getElementById('app-structured-data') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'app-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [route, products]);

  return null;
};
