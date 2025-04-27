import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hy'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/calculator': '/calculator',
    '/calendar': '/calendar',
    '/profile': '/profile',
    '/login': '/login',
    '/sign-up': '/sign-up',
  },
});
