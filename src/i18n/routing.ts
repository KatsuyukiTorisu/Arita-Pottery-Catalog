import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ja', 'ko', 'zh-CN', 'zh-TW', 'fr', 'de', 'id'],
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number];
