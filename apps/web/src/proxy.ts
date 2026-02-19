import { NextResponse, type NextRequest } from 'next/server'
import { isAuthenticated } from './auth/auth'

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)',
  ],
}

export async function proxy(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }
  const response = NextResponse.next()

  const { pathname } = request.nextUrl
  if (pathname.startsWith('/org')) {
    const slug = pathname.split('/')[2]
    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  return response
}
