import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { getUserRole } from '@/app/actions/getUserRole';

type UserRole = 'admin' | 'employee' | 'customer' | 'unauthorized';

// Define protected routes and their allowed roles
const routePermissions: Record<string, UserRole[]> = {
  '/home': ['admin', 'employee', 'customer'],
  '/orders': ['admin', 'employee', 'customer'],
  '/users': ['admin'],
};

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith('/auth')) {
    return authRes;
  }

  const { origin } = new URL(request.url);
  const session = await auth0.getSession();

  const currentPath = Object.keys(routePermissions).find(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (currentPath) {
    if (!session) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    const userRole = await getUserRole();
    const allowedRoles = routePermissions[currentPath];

    if (!allowedRoles?.includes(userRole)) {
      return NextResponse.redirect(`${origin}/unauthorized`);
    }
  }

  return authRes;
}