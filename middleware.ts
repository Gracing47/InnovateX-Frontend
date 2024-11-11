import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self';",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline';",
      "style-src 'self' 'unsafe-inline';",
      "img-src 'self' blob: data:;",
      "font-src 'self';",
      "connect-src 'self' https://api.openai.com;",
      "frame-src 'self';"
    ].join(' ')
  )

  return response
}

export const config = {
  matcher: '/:path*',
} 