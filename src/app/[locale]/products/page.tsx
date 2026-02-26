import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import ProductCard from '@/components/products/ProductCard';

type Props = { params: Promise<{ locale: string }> };

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('products');
  const session = await getSession();

  const products = await db.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    include: { company: { select: { id: true, name: true, slug: true } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-500">{t('empty')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
  );
}
