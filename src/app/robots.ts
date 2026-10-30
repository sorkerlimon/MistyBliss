import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mistybliss.online';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/search', '/shop', '/categories/', '/products/', '/about', '/contact', '/shipping-returns', '/llms.txt'],
        disallow: ['/admin', '/api/'],
      },
      // Search Engine & AI Chatbot Crawlers
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Google-Extended',
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Applebot',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
        ],
        allow: ['/', '/search', '/shop', '/categories/', '/products/', '/llms.txt'],
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
