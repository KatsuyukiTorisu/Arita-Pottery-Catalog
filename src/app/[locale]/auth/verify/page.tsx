import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTranslations('auth.verify');

  // eslint-disable-next-line prefer-const
  let status: string = 'loading';
  let message = t('loading');

  if (!token) {
    status = 'error';
    message = t('error');
  } else {
    try {
      const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/auth/verify?token=${token}`, {
        cache: 'no-store',
      });

      if (res.ok) {
        status = 'success';
        message = t('success');
      } else {
        status = 'error';
        const data = await res.json().catch(() => ({}));
        message = data.error ?? t('error');
      }
    } catch {
      status = 'error';
      message = t('error');
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('title')}</h1>

        {status === 'loading' && (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>{message}</span>
          </div>
        )}

        {status === 'success' && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-6">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-green-800 mb-4">{message}</p>
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-6">
            <div className="text-4xl mb-3">❌</div>
            <p className="text-red-800 mb-4">{message}</p>
            <Link
              href={`/${locale}/auth/signup`}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors"
            >
              Sign up again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
