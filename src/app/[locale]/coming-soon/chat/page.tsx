import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

type Props = { params: Promise<{ locale: string }> };

export default async function ChatPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('comingSoon');
  const tf = await getTranslations('footer');

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{tf('chat')}</h1>
        <p className="text-lg text-primary font-semibold mb-4">{t('title')}</p>
        <p className="text-gray-600 mb-8">{t('subtitle')}</p>
        <Link href={`/${locale}`} className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-2.5 font-medium hover:bg-primary-dark transition-colors">
          ← {t('back')}
        </Link>
      </div>
    </div>
  );
}
