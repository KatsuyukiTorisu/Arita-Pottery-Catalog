import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    images: string[];
    _count?: { products: number };
  };
  locale: string;
}

export default function CompanyCard({ company, locale }: CompanyCardProps) {
  const t = useTranslations('companies');
  const image = company.images[0];

  return (
    <Link
      href={`/${locale}/companies/${company.slug}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
    >
      <div className="h-48 bg-gray-100 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={company.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
          {company.name}
        </h3>

        {company.location && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {company.location}
          </p>
        )}

        {company.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{company.description}</p>
        )}

        <div className="flex items-center justify-between">
          {company._count != null && (
            <span className="text-xs text-gray-500">
              {company._count.products} {t('products')}
            </span>
          )}
          <span className="text-xs text-primary font-medium ml-auto group-hover:underline">
            {t('viewDetails')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
