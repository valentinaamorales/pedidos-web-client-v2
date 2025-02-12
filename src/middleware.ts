import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

const protectedRoutes = ['/home', '/orders', '/users'];

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith('/auth')) {
    return authRes;
  }

  const { origin } = new URL(request.url);
  const session = await auth0.getSession();
  // console.log("session", session);

  if (
    protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  ) {
    if (!session) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }
  }

  return authRes;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    '/auth/:path*',
    '/home/:path*',
    '/orders/:path*',
    '/users/:path*',
  ],
};
