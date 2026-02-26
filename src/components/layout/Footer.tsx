import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">有田</span>
              <span className="text-xl font-semibold text-gray-200">Catalog</span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting the world with Arita&#39;s finest ceramic artistry.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('comingSoon')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/coming-soon/purchase`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('purchase')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/coming-soon/booking`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('booking')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/coming-soon/chat`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('chat')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/products`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/companies`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Companies
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/auth/signup`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Become a Member
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500 text-center">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
