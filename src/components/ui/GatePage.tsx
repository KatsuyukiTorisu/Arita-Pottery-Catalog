import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface GatePageProps {
  locale: string;
}

export default function GatePage({ locale }: GatePageProps) {
  const t = useTranslations('gate');

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('title')}</h1>
        <p className="text-gray-600 mb-8">{t('subtitle')}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}/auth/login`}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors"
          >
            {t('loginCta')}
          </Link>
          <Link
            href={`/${locale}/auth/signup`}
            className="inline-flex items-center justify-center rounded-lg border border-primary text-primary px-6 py-2.5 font-medium hover:bg-primary hover:text-white transition-colors"
          >
            {t('signupCta')}
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500 border-t border-gray-200 pt-6">
          {t('marketNote')}
        </p>
      </div>
    </div>
  );
}
