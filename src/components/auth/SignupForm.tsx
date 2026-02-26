'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SignupFormProps {
  locale: string;
}

export default function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations('auth.signup');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    age: '', gender: '', address: '', occupation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        ...(form.age ? { age: parseInt(form.age) } : {}),
        ...(form.gender ? { gender: form.gender } : {}),
        ...(form.address ? { address: form.address } : {}),
        ...(form.occupation ? { occupation: form.occupation } : {}),
      };

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t('error'));
        return;
      }

      setSuccess(true);
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 px-6 py-8 text-center">
        <div className="mb-4 text-4xl">📧</div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">Check your email</h3>
        <p className="text-green-700">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Input label={t('name')} value={form.name} onChange={handleChange('name')} required />
      <Input label={t('email')} type="email" value={form.email} onChange={handleChange('email')} required autoComplete="email" />
      <Input label={t('phone')} type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="+81-0000-0000" required autoComplete="tel" />
      <Input label={t('password')} type="password" value={form.password} onChange={handleChange('password')} required autoComplete="new-password" hint="Minimum 8 characters" />
      <Input label={t('age')} type="number" value={form.age} onChange={handleChange('age')} min={1} max={120} />
      <Input label={t('gender')} value={form.gender} onChange={handleChange('gender')} placeholder="e.g. male, female, other" />
      <Input label={t('address')} value={form.address} onChange={handleChange('address')} />
      <Input label={t('occupation')} value={form.occupation} onChange={handleChange('occupation')} />

      <Button type="submit" loading={loading} className="w-full">
        {t('submit')}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {t('hasAccount')}{' '}
        <Link href={`/${locale}/auth/login`} className="text-primary font-medium hover:underline">
          {t('loginLink')}
        </Link>
      </p>
    </form>
  );
}
