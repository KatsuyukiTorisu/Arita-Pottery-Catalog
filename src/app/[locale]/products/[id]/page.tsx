import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { canViewDetail } from '@/lib/access-control';
import GatePage from '@/components/ui/GatePage';
import { formatPrice } from '@/lib/utils';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations('products');
  const session = await getSession();

  // Gate check
  if (!canViewDetail(session)) {
    return <GatePage locale={locale} />;
  }

  const product = await db.product.findUnique({
    where: { id },
    include: {
      company: true,
      whitelist: { select: { memberUserId: true } },
    },
  });

  if (!product || !product.isPublished) notFound();

  // Visibility checks for logged-in users
  if (product.visibilityMode === 'MEMBERS_ONLY' && !session) {
    return <GatePage locale={locale} />;
  }

  if (product.visibilityMode === 'WHITELIST') {
    if (!session) return <GatePage locale={locale} />;
    const inWhitelist = product.whitelist.some((w) => w.memberUserId === session.userId);
    if (!inWhitelist && session.role !== 'ADMIN') {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">This product is only available to selected members.</p>
          <Link href={`/${locale}/products`} className="text-primary hover:underline">
            ← Back to Products
          </Link>
        </div>
      );
    }
  }

  const image = product.images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${locale}/products`} className="text-sm text-primary hover:underline mb-6 inline-flex items-center gap-1">
        ← {t('title')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.images.slice(1, 5).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt="" className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.company && (
            <Link
              href={`/${locale}/companies/${product.company.slug}`}
              className="text-sm text-primary hover:underline mb-2 block"
            >
              {product.company.name}
            </Link>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {product.price != null && session && (
            <div className="text-2xl font-bold text-primary mb-6">
              {formatPrice(Number(product.price))}
            </div>
          )}

          {product.description && (
            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="space-y-3">
            {product.category && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">{t('category')}:</span>
                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-gray-500 mt-0.5">{t('tags')}:</span>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.visibilityMode !== 'PUBLIC' && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Access:</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {t('membersOnly')}
                </span>
              </div>
            )}
          </div>

          {!session && (
            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-gray-700">
                <Link href={`/${locale}/auth/login`} className="text-primary font-medium hover:underline">
                  Login
                </Link>{' '}
                or{' '}
                <Link href={`/${locale}/auth/signup`} className="text-primary font-medium hover:underline">
                  become a member
                </Link>{' '}
                to see pricing and purchase options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
