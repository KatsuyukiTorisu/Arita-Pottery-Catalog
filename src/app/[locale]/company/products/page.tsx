'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import ProductForm from '@/components/products/ProductForm';
import CompanySidebar from '@/components/layout/CompanySidebar';
import { formatPrice } from '@/lib/utils';
import type { ProductData } from '@/types';

export default function CompanyProductsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('company.products');

  const [products, setProducts] = useState<ProductData[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const accountRes = await fetch('/api/account');
    const accountData = await accountRes.json();
    const userId = accountData.user?.id;
    if (!userId) return;

    // Get company via products list (filtered by company)
    const compRes = await fetch('/api/companies');
    const compData = await compRes.json();
    const myCompany = compData.companies?.find((c: { ownerUserId: string }) => c.ownerUserId === userId);
    if (!myCompany) { setLoading(false); return; }

    setCompanyId(myCompany.id);
    const prodRes = await fetch(`/api/products?companyId=${myCompany.id}`);
    const prodData = await prodRes.json();
    setProducts(prodData.products ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = (product: ProductData) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = product; return next; }
      return [product, ...prev];
    });
    setShowForm(false);
    setEditProduct(null);
  };

  const visibilityBadge: Record<string, string> = {
    PUBLIC: 'bg-green-100 text-green-700',
    MEMBERS_ONLY: 'bg-amber-100 text-amber-700',
    WHITELIST: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)]">
      <CompanySidebar locale={locale} active="products" />
      <main className="flex-1 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <Button onClick={() => { setEditProduct(null); setShowForm(true); }}>
            + {t('add')}
          </Button>
        </div>

        {(showForm || editProduct) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editProduct ? t('edit') : t('add')}
            </h2>
            <ProductForm
              product={editProduct ?? undefined}
              companyId={companyId}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditProduct(null); }}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No products yet. Add your first product!</div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${visibilityBadge[product.visibilityMode] ?? ''}`}>
                      {product.visibilityMode}
                    </span>
                    {!product.isPublished && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {product.price != null ? formatPrice(Number(product.price)) : '—'}
                    {product.category ? ` · ${product.category}` : ''}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { setEditProduct(product); setShowForm(false); }}
                  >
                    {t('edit')}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                    {t('delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
