import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tn = await getTranslations('nav');

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center justify-center rounded-lg bg-white text-primary px-6 py-3 font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('hero.explore')}
              </Link>
              <Link
                href={`/${locale}/auth/signup`}
                className="inline-flex items-center justify-center rounded-lg border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                {t('hero.join')}
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 hidden lg:block">
          <div className="w-full h-full flex items-center justify-center text-[20rem] font-bold select-none">
            有
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.exclusive')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t('features.exclusiveDesc')}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.market')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t('features.marketDesc')}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.authentic')}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t('features.authenticDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to explore?</h2>
          <p className="text-gray-600 mb-8">Browse our catalog of authentic Arita pottery from Japan&#39;s finest artisans.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
            >
              {tn('products')}
            </Link>
            <Link
              href={`/${locale}/companies`}
              className="inline-flex items-center justify-center rounded-lg border border-primary text-primary px-6 py-3 font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              {tn('companies')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
