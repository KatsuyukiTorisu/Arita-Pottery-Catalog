import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CompanySidebar from '@/components/layout/CompanySidebar';

type Props = { params: Promise<{ locale: string }> };

export default async function CompanyDashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('company.dashboard');
  const session = await getSession();

  if (!session || (session.role !== 'COMPANY' && session.role !== 'ADMIN')) {
    redirect(`/${locale}/auth/login`);
  }

  const company = await db.company.findUnique({
    where: { ownerUserId: session.userId },
    include: { _count: { select: { products: true } } },
  });

  const publishedCount = company
    ? await db.product.count({ where: { companyId: company.id, isPublished: true } })
    : 0;
  const draftCount = company ? company._count.products - publishedCount : 0;

  return (
    <div className="flex min-h-[calc(100vh-128px)]">
      <CompanySidebar locale={locale} active="dashboard" />

      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600 mb-8">{t('welcome')}</p>

        {!company ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-semibold text-amber-800 mb-2">No Company Profile</h3>
            <p className="text-amber-700 text-sm mb-4">
              You haven&#39;t set up your company profile yet.
            </p>
            <Link
              href={`/${locale}/company/settings`}
              className="inline-flex items-center rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Set up company
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard label={t('totalProducts')} value={company._count.products} />
              <StatCard label={t('published')} value={publishedCount} color="green" />
              <StatCard label={t('drafts')} value={draftCount} color="gray" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{company.name}</h2>
                <Link
                  href={`/${locale}/companies/${company.slug}`}
                  className="text-sm text-primary hover:underline"
                  target="_blank"
                >
                  View public page →
                </Link>
              </div>
              {company.location && (
                <p className="text-sm text-gray-500">{company.location}</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, color = 'blue' }: { label: string; value: number; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[color] ?? colors.blue} -m-1 inline-block px-2 py-0.5 rounded-lg`}>
        {value}
      </p>
    </div>
  );
}
