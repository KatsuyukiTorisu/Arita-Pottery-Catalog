import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string | null;
    images: string[];
    price?: number | null;
    category?: string | null;
    visibilityMode: string;
    company?: { name: string; slug: string } | null;
  };
  locale: string;
  showPrice?: boolean;
}

export default function ProductCard({ product, locale, showPrice = false }: ProductCardProps) {
  const t = useTranslations('products');
  const image = product.images[0];

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.visibilityMode !== 'PUBLIC' && (
            <span className="flex-shrink-0 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {t('membersOnly')}
            </span>
          )}
        </div>

        {product.company && (
          <p className="text-xs text-gray-500 mb-2">{product.company.name}</p>
        )}

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          {product.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
          {showPrice && product.price != null ? (
            <span className="text-sm font-semibold text-primary ml-auto">
              {formatPrice(Number(product.price))}
            </span>
          ) : (
            <span className="text-xs text-gray-400 ml-auto">{t('viewDetails')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
