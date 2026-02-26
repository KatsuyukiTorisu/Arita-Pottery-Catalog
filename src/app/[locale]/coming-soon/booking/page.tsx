import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = { params: Promise<{ locale: string }> };

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('comingSoon');
  const tf = await getTranslations('footer');

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{tf('booking')}</h1>
        <p className="text-lg text-primary font-semibold mb-4">{t('title')}</p>
        <p className="text-gray-600 mb-8">{t('subtitle')}</p>
        <Link href={`/${locale}`} className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors">
          ← {t('back')}
        </Link>
      </div>
    </div>
  );
}
