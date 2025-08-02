import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if NEXTAUTH_SECRET is available
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET is not set in production environment');
    // If no secret and trying to access protected route, redirect to signin
    if (pathname.startsWith('/collection')) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    return NextResponse.next();
  }
  
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      // Let NextAuth auto-detect the cookie name
      secureCookie: process.env.NODE_ENV === 'production'
    });

    // If user is authenticated and trying to access auth pages, redirect to collection
    if (token && (pathname === '/signin' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/collection', req.url));
    }

    // If user is not authenticated and trying to access protected pages, redirect to signin
    if (!token && pathname.startsWith('/collection')) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // If there's an error getting the token and user is trying to access protected route
    if (pathname.startsWith('/collection')) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/collection/:path*',
    '/signin',
    '/signup',
  ],
};
