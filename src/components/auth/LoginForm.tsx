'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === 'UNVERIFIED') {
          setError(t('unverified'));
        } else {
          setError(data.error ?? t('error'));
        }
        return;
      }

      // Redirect based on role
      const role = data.user?.role;
      if (role === 'COMPANY' || role === 'ADMIN') {
        router.push(`/${locale}/company`);
      } else {
        router.push(`/${locale}/account`);
      }
      router.refresh();
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Input
        label={t('phone')}
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+81-0000-0000"
        required
        autoComplete="tel"
      />

      <Input
        label={t('password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <Button type="submit" loading={loading} className="w-full">
        {t('submit')}
      </Button>

      <p className="text-center text-sm text-gray-600">
        {t('noAccount')}{' '}
        <Link href={`/${locale}/auth/signup`} className="text-primary font-medium hover:underline">
          {t('signupLink')}
        </Link>
      </p>
    </form>
  );
}
