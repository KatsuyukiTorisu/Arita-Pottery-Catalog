'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import CompanyForm from '@/components/companies/CompanyForm';
import CompanySidebar from '@/components/layout/CompanySidebar';
import type { CompanyData } from '@/types';

export default function CompanySettingsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('company.settings');

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then(async (data) => {
        const accountRes = await fetch('/api/account');
        const accountData = await accountRes.json();
        const userId = accountData.user?.id;
        const mine = data.companies?.find((c: CompanyData & { ownerUserId: string }) => c.ownerUserId === userId);
        setCompany(mine ?? null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-128px)]">
        <CompanySidebar locale={locale} active="settings" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-128px)]">
      <CompanySidebar locale={locale} active="settings" />
      <main className="flex-1 p-6 lg:p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <CompanyForm
            company={company ?? undefined}
            onSave={(updated) => setCompany(updated)}
          />
        </div>
      </main>
    </div>
  );
}
