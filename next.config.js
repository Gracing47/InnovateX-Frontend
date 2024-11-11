/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Only apply CSP in production
    if (process.env.NODE_ENV !== 'production') {
      return []
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' blob: data:;",
              "font-src 'self';",
              "connect-src 'self';",
              "frame-src 'self';"
            ].join(' ')
          }
        ],
      },
    ]
  },
  reactStrictMode: true,
}

module.exports = nextConfig