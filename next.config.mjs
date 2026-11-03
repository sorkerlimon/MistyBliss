/** @type {import('next').NextConfig} */
const turnstileConnect = [
  'https://challenges.cloudflare.com',
  'https://*.challenges.cloudflare.com',
  'https://hagen.challenges.cloudflare.com',
  'https://brunhild.challenges.cloudflare.com',
  'https://*.alg13.dnstest.challenges.cloudflare.com',
].join(' ');

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  // Scripts: Next + Turnstile
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
  // Styles + Google Fonts CSS
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Images
  "img-src 'self' data: blob: https:",
  // Fonts
  "font-src 'self' data: https://fonts.gstatic.com",
  // XHR / fetch / Turnstile percolation tests use data: and challenge hosts
  [
    "connect-src 'self'",
    'data:',
    'blob:',
    'ws:',
    'wss:',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://*.supabase.co',
    'wss://*.supabase.co',
    turnstileConnect,
  ].join(' '),
  // Turnstile widget iframe
  "frame-src 'self' https://challenges.cloudflare.com https://*.challenges.cloudflare.com",
  "child-src 'self' blob: https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "form-action 'self'",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.0.110'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
