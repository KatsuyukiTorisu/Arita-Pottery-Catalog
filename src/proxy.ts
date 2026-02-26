import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { verifyToken } from './lib/jwt';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Determine which locale this path uses
  const matchedLocale = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (matchedLocale) {
    const restPath = pathname.slice(matchedLocale.length + 1); // strip /locale

    const isAccountRoute =
      restPath === 'account' || restPath.startsWith('account/');
    const isCompanyRoute =
      restPath === 'company' || restPath.startsWith('company/');

    if (isAccountRoute || isCompanyRoute) {
      const token = request.cookies.get('auth-token')?.value;
      let session = null;

      if (token) {
        try {
          session = await verifyToken(token);
        } catch {
          // invalid token — treat as unauthenticated
        }
      }

      if (!session) {
        return NextResponse.redirect(
          new URL(`/${matchedLocale}/auth/login`, request.url),
        );
      }

      if (isCompanyRoute && session.role !== 'COMPANY' && session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL(`/${matchedLocale}`, request.url));
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
