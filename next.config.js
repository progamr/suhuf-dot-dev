/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these server-only modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
      };
    }
    
    // Exclude server-only modules from client bundle
    if (!isServer) {
      config.externals = [
        ...(config.externals || []), 
        'bcrypt',
        '@mikro-orm/core',
        '@mikro-orm/postgresql',
        '@mikro-orm/knex',
        'mariadb/callback',
      ];
    }
    
    return config;
  },
  
  // Disable server components for middleware to avoid edge runtime issues
  experimental: {
    serverComponentsExternalPackages: ['@mikro-orm/core', '@mikro-orm/postgresql', 'bcrypt'],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
