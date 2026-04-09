import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const rawToken =
    request.cookies.get('accessToken')?.value ??
    request.cookies.get('access_token')?.value ??
    request.cookies.get('token')?.value;
  const token = rawToken?.trim();
  const hasToken = Boolean(token && token !== 'undefined' && token !== 'null');

  const isLoginPath = pathname === '/login' || pathname === '/login/';
  const isDashboardPath =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  if (pathname === '/') {
    if (hasToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isDashboardPath && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoginPath && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login/:path*', '/dashboard/:path*'],
};