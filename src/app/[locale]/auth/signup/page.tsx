import { getTranslations } from 'next-intl/server';
import SignupForm from '@/components/auth/SignupForm';

type Props = { params: Promise<{ locale: string }> };

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('auth.signup');

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 mt-2">Arita Catalog</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <SignupForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
