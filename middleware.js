import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const session = await auth.api
    .getSession({ headers: request.headers })
    .catch(() => null);
  const user = session?.user;
  const isLoggedIn = Boolean(user);

  const isAuthRoute = pathname === '/sign-in' || pathname === '/sign-up';
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/services' ||
    pathname.startsWith('/services/') ||
    isAuthRoute;

  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/payment');

  if (isDashboardRoute && !isLoggedIn) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isLoggedIn) {
    const role = user?.role || 'customer';
    const url = new URL(
      `/dashboard/${role === 'customer' || role === 'technician' || role === 'admin' ? role : 'customer'}`,
      request.url,
    );
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*|\\/api).*)'],
};
