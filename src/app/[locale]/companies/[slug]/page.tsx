import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { canViewDetail } from '@/lib/access-control';
import GatePage from '@/components/ui/GatePage';
import ProductCard from '@/components/products/ProductCard';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CompanyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations('companies');
  const tp = await getTranslations('products');
  const session = await getSession();

  if (!canViewDetail(session)) {
    return <GatePage locale={locale} />;
  }

  const company = await db.company.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!company) notFound();

  const image = company.images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${locale}/companies`} className="text-sm text-primary hover:underline mb-6 inline-flex items-center gap-1">
        ← {t('title')}
      </Link>

      {/* Company Header */}
      <div className="mt-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {image && (
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={company.name} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          <div className={image ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{company.name}</h1>
            {company.location && (
              <p className="text-gray-500 flex items-center gap-1.5 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {company.location}
              </p>
            )}
            {company.description && (
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{tp('title')}</h2>
        {company.products.length === 0 ? (
          <p className="text-gray-500">{tp('empty')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {company.products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: session ? (product.price ? Number(product.price) : null) : null,
                }}
                locale={locale}
                showPrice={!!session}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
