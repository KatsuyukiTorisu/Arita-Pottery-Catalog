'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type UserData = {
  id: string;
  membershipId: string;
  name: string;
  email: string;
  phone: string;
  age?: number | null;
  gender?: string | null;
  address?: string | null;
  occupation?: string | null;
  role: string;
};

export default function AccountPage() {
  const t = useTranslations('account');
  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState({ name: '', age: '', gender: '', address: '', occupation: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/account')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setForm({
            name: d.user.name ?? '',
            age: d.user.age?.toString() ?? '',
            gender: d.user.gender ?? '',
            address: d.user.address ?? '',
            occupation: d.user.occupation ?? '',
          });
        }
      });
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setLoading(true);

    try {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          ...(form.age ? { age: parseInt(form.age) } : {}),
          ...(form.gender ? { gender: form.gender } : {}),
          ...(form.address ? { address: form.address } : {}),
          ...(form.occupation ? { occupation: form.occupation } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Save failed'); return; }

      setUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const roleBadge: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    COMPANY: 'bg-blue-100 text-blue-700',
    MEMBER: 'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      {/* Membership Info */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t('membershipId')}</p>
            <p className="text-lg font-mono font-bold text-primary mt-1">{user.membershipId}</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${roleBadge[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
            {user.role}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
          <div><span className="font-medium text-gray-700">{t('email')}:</span> {user.email}</div>
          <div><span className="font-medium text-gray-700">{t('phone')}:</span> {user.phone}</div>
        </div>
      </div>

      {/* Edit Profile */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{t('profile')}</h2>

        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {saved && <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{t('saved')}</div>}

        <Input label={t('name')} value={form.name} onChange={handleChange('name')} required />
        <Input label={t('age')} type="number" value={form.age} onChange={handleChange('age')} min={1} max={120} />
        <Input label={t('gender')} value={form.gender} onChange={handleChange('gender')} />
        <Input label={t('address')} value={form.address} onChange={handleChange('address')} />
        <Input label={t('occupation')} value={form.occupation} onChange={handleChange('occupation')} />

        <Button type="submit" loading={loading}>{t('save')}</Button>
      </form>
    </div>
  );
}
