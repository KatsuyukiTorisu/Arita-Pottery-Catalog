'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUploader from '@/components/ui/ImageUploader';
import type { CompanyData } from '@/types';

interface CompanyFormProps {
  company?: Partial<CompanyData>;
  onSave: (company: CompanyData) => void;
}

export default function CompanyForm({ company, onSave }: CompanyFormProps) {
  const t = useTranslations('company.settings');
  const tc = useTranslations('common');

  const [form, setForm] = useState({
    name: company?.name ?? '',
    description: company?.description ?? '',
    location: company?.location ?? '',
  });
  const [images, setImages] = useState<string[]>(company?.images ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setLoading(true);

    try {
      const body = {
        name: form.name,
        description: form.description || undefined,
        location: form.location || undefined,
        images,
      };

      const url = company?.slug ? `/api/companies/${company.slug}` : '/api/companies';
      const method = company?.slug ? 'PUT' : 'POST';

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

      setSaved(true);
      onSave(data.company);
    } catch {
      setError(tc('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {saved && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{t('saved')}</div>
      )}

      <Input label={t('companyName')} value={form.name} onChange={handleChange('name')} required />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
        <textarea
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <Input label={t('location')} value={form.location} onChange={handleChange('location')} placeholder="Arita, Saga Prefecture, Japan" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('images')}</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <Button type="submit" loading={loading}>{t('save')}</Button>
    </form>
  );
}
