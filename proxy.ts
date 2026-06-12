import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/api/webhooks', '/api/auth'];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  if (hasClerk) {
    // Clerk middleware loaded dynamically
    const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server');
    const matcher = createRouteMatcher(PUBLIC_PATHS.map((p) => p + '(.*)'));
    return clerkMiddleware(async (auth, req) => {
      if (!matcher(req)) await auth.protect();
    })(request, {} as NextFetchEvent);
  }

  // Dev auth: check cookie
  const devCookie = request.cookies.get('hri-dev-auth')?.value;
  if (devCookie !== 'true') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
