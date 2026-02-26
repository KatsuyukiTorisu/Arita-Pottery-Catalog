'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import type { ProductData } from '@/types';

interface ProductFormProps {
  product?: Partial<ProductData>;
  companyId: string;
  onSave: (product: ProductData) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, companyId, onSave, onCancel }: ProductFormProps) {
  const t = useTranslations('company.products');
  const tc = useTranslations('common');

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price != null ? String(product.price) : '',
    category: product?.category ?? '',
    tags: product?.tags?.join(', ') ?? '',
    images: product?.images?.join('\n') ?? '',
    isPublished: product?.isPublished ?? false,
    visibilityMode: product?.visibilityMode ?? 'PUBLIC',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = {
        name: form.name,
        description: form.description || undefined,
        price: form.price ? parseFloat(form.price) : undefined,
        category: form.category || undefined,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: form.images.split('\n').map((u) => u.trim()).filter(Boolean),
        isPublished: form.isPublished,
        visibilityMode: form.visibilityMode,
        companyId,
      };

      const url = product?.id ? `/api/products/${product.id}` : '/api/products';
      const method = product?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? tc('error'));
        return;
      }

      onSave(data.product);
    } catch {
      setError(tc('error'));
    } finally {
      setLoading(false);
    }
  };

  const visibilityOptions = [
    { value: 'PUBLIC', label: tc('public') },
    { value: 'MEMBERS_ONLY', label: tc('membersOnly') },
    { value: 'WHITELIST', label: tc('whitelist') },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Input label={t('name')} value={form.name} onChange={handleChange('name')} required />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          rows={3}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <Input label={t('price')} type="number" value={form.price} onChange={handleChange('price')} min={0} step={0.01} />
      <Input label={t('category')} value={form.category} onChange={handleChange('category')} />
      <Input label={t('tags')} value={form.tags} onChange={handleChange('tags')} placeholder="blue-white, traditional, handmade" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('images')}</label>
        <textarea
          value={form.images}
          onChange={handleChange('images')}
          rows={3}
          placeholder="https://example.com/image1.jpg"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
        />
      </div>

      <Select
        label={t('visibility')}
        value={form.visibilityMode}
        onChange={handleChange('visibilityMode')}
        options={visibilityOptions}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={handleChange('isPublished')}
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-medium text-gray-700">{t('published')}</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>{t('save')}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>{t('cancel')}</Button>
      </div>
    </form>
  );
}
