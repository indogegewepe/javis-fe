import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token =
    request.cookies.get('accessToken')?.value ??
    request.cookies.get('access_token')?.value ??
    request.cookies.get('token')?.value;

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};