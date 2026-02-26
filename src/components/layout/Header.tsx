'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import type { SessionPayload } from '@/types';

interface HeaderProps {
  locale: string;
  session: SessionPayload | null;
}

export default function Header({ locale, session }: HeaderProps) {
  const t = useTranslations('nav');
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/auth/login`);
    router.refresh();
  };

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/companies`, label: t('companies') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">有田</span>
            <span className="text-xl font-semibold text-gray-800">Catalog</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {session && (session.role === 'COMPANY' || session.role === 'ADMIN') && (
              <Link
                href={`/${locale}/company`}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                {t('companyPortal')}
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            {session ? (
              <>
                <Link
                  href={`/${locale}/account`}
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  {t('account')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="inline-flex items-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session && (session.role === 'COMPANY' || session.role === 'ADMIN') && (
            <Link
              href={`/${locale}/company`}
              className="block text-sm font-medium text-gray-700 hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {t('companyPortal')}
            </Link>
          )}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <LanguageSwitcher locale={locale} />
            {session ? (
              <>
                <Link href={`/${locale}/account`} className="text-sm font-medium text-gray-700">
                  {t('account')}
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-gray-700">
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} className="text-sm font-medium text-gray-700">
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium"
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
