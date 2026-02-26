import { getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import CompanyCard from '@/components/companies/CompanyCard';

type Props = { params: Promise<{ locale: string }> };

export default async function CompaniesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('companies');

  const companies = await db.company.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { products: { where: { isPublished: true } } } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-24 text-gray-500">{t('empty')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
