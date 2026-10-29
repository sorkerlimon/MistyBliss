'use client';

import React, { useEffect } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useShop } from '../../context/ShopContext';

export const SEO: React.FC = () => {
  const { route } = useRouter();
  const { products, categories } = useShop();

  useEffect(() => {
    let title = 'Buy Home Decor Online in Bangladesh | Luxury Interior Décor – Misty Bliss';
    let description =
      'Shop luxury home decor online in Bangladesh at Misty Bliss. Buy ceramics, vases, lighting, wall decor, cushions, candles & stylish home decoration items with WhatsApp support.';
    let jsonLd: object | null = null;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mistybliss.com';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mistybliss.com';

    switch (route.type) {
      case 'home':
        title = 'Buy Home Decor Online in Bangladesh | Luxury Interior Décor – Misty Bliss';
        description =
          'Shop luxury home decor online in Bangladesh at Misty Bliss. Buy ceramics, vases, lighting, wall decor, cushions, candles & stylish home decoration items with WhatsApp support.';
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Misty Bliss',
          url: origin,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${origin}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };
        break;

      case 'search': {
        const query = route.searchParams.q || '';
        title = query
          ? `Search results for "${query}" | Misty Bliss Décor`
          : 'Search Artisanal Home Décor & Ceramics | Misty Bliss';
        description = query
          ? `Explore handcrafted stoneware, botanical arrangements, and lighting matching "${query}" at Misty Bliss.`
          : 'Search our curated catalog of hand-thrown pottery, ambient lamps, Belgian linens, and home accents.';
        
        // Filter products matching query for ItemList schema
        const q = query.trim().toLowerCase();
        const matched = q
          ? products.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.material.toLowerCase().includes(q) ||
                p.categorySlug.toLowerCase().includes(q)
            ).slice(0, 10)
          : products.slice(0, 10);

        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'SearchResultsPage',
          name: title,
          url: currentUrl,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: matched.length,
            itemListElement: matched.map((prod, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: prod.name,
                url: `${origin}/products/${prod.slug}`,
                image: prod.images[0],
                description: prod.description,
                material: prod.material,
                offers: {
                  '@type': 'Offer',
                  price: prod.price,
                  priceCurrency: 'USD',
                  availability: prod.stockStatus === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                },
              },
            })),
          },
        };
        break;
      }

      case 'shop': {
        const isSale = route.searchParams.sale === 'true';
        const isNew = route.searchParams.new === 'true';
        const isBestseller = route.searchParams.bestseller === 'true';

        if (isSale) {
          title = 'Special Offers & Archive Sale | Misty Bliss Décor';
          description = 'Browse limited-time offers on handcrafted ceramic vessels, brass accents, and tactile linen home accessories.';
        } else if (isNew) {
          title = 'New Spring Arrivals | Handcrafted Décor & Ceramics | Misty Bliss';
          description = 'Explore our newest collection of sculptural stoneware, fluted lighting, and sustainable interior accents.';
        } else if (isBestseller) {
          title = 'Customer Bestsellers | Most-Loved Home Décor | Misty Bliss';
          description = 'Discover the most cherished ceramics, candles, and decorative trays selected by modern interior enthusiasts.';
        } else {
          title = 'Shop Home Decor Online in Bangladesh | Misty Bliss';
          description = 'Explore the full catalog of handcrafted stoneware, warm ambient lighting, organic linen textiles, and artisanal wares.';
        }

        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: currentUrl,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products.slice(0, 12).length,
            itemListElement: products.slice(0, 12).map((prod, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${origin}/products/${prod.slug}`,
              name: prod.name,
            })),
          },
        };
        break;
      }

      case 'category': {
        const cat = categories.find((c) => c.slug === route.slug);
        const catName = cat ? cat.name : 'Category Collection';
        title = `${catName} – Artisanal Home Décor | Misty Bliss`;
        description = `Browse our handcrafted collection of ${catName.toLowerCase()}, meticulously curated with natural materials and timeless forms.`;
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: currentUrl,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
              { '@type': 'ListItem', position: 2, name: 'Shop', item: `${origin}/shop` },
              { '@type': 'ListItem', position: 3, name: catName, item: currentUrl },
            ],
          },
        };
        break;
      }

      case 'product': {
        const prod = products.find((p) => p.slug === route.slug);
        if (prod) {
          title = `${prod.name} – Handcrafted Décor | Misty Bliss`;
          description = `${prod.name}: ${prod.description.slice(0, 140)}... Handcrafted in ${prod.material}. Free delivery over $75.`;
          jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: prod.name,
            image: prod.images,
            description: prod.description,
            sku: prod.id,
            brand: {
              '@type': 'Brand',
              name: 'Misty Bliss',
            },
            material: prod.material,
            offers: {
              '@type': 'Offer',
              price: prod.price,
              priceCurrency: 'USD',
              priceValidUntil: '2026-12-31',
              itemCondition: 'https://schema.org/NewCondition',
              availability: prod.stockStatus === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: currentUrl,
              seller: {
                '@type': 'Organization',
                name: 'Misty Bliss',
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: prod.rating.toString(),
              reviewCount: Math.max(prod.reviewCount, 1).toString(),
              bestRating: '5',
              worstRating: '1',
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

    // Helper to set or create meta tags
    const setMetaTag = (attribute: string, key: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const shareImage = `${origin}/images/og-share.jpg`;

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', shareImage);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', 'Misty Bliss');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', shareImage);

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
  }, [route, products, categories]);

  return null;
};
