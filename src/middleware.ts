import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'dashboard_session';

// PLACEHOLDER MODE: the real app is temporarily dark to the public.
// Only the placeholder homepage and the assets it needs are servable;
// every other path (dashboard, autopilot, proposals, previews, outreach,
// APIs, client preview subdomains) 404s. Flip to false to bring the
// full site back online.
const PLACEHOLDER_MODE = true;
const PLACEHOLDER_ALLOWED_PATHS = new Set(['/', '/favicon.svg', '/favicon.ico', '/logo.svg']);

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PLACEHOLDER_MODE) {
    if (PLACEHOLDER_ALLOWED_PATHS.has(pathname) || pathname.startsWith('/_next')) {
      return NextResponse.next();
    }
    return new NextResponse(null, { status: 404 });
  }

  const host = request.headers.get('host') || '';

  // Handle subdomain routing for preview sites: *.sites.homebaked.dev
  const subdomainMatch = host.match(/^([a-z0-9-]+)\.sites\.homebaked\.dev$/);
  if (subdomainMatch) {
    const slug = subdomainMatch[1];
    // Skip reserved subdomains
    if (!['www', 'mail', 'sites'].includes(slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/preview/${slug}/index.html`;
      return NextResponse.rewrite(url);
    }
  }

  // Skip public pages: homepage, login, public API endpoints, preview files
  if (
    pathname === '/' ||
    pathname === '/dashboard/login' ||
    pathname === '/api/dashboard/sessions/sync' ||
    pathname.startsWith('/preview/') ||
    pathname.startsWith('/outreach/')
  ) {
    return NextResponse.next();
  }

  // Only protect dashboard and autopilot routes
  if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/api/dashboard') &&
      !pathname.startsWith('/autopilot') && !pathname.startsWith('/api/autopilot')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isApi = pathname.startsWith('/api/');

  if (!token) {
    if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
