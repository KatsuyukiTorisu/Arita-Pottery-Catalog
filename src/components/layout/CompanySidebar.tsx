import Link from 'next/link';

interface CompanySidebarProps {
  locale: string;
  active: 'dashboard' | 'products' | 'settings';
}

const links = [
  { href: (locale: string) => `/${locale}/company`, label: 'Dashboard', key: 'dashboard' as const },
  { href: (locale: string) => `/${locale}/company/products`, label: 'Products', key: 'products' as const },
  { href: (locale: string) => `/${locale}/company/settings`, label: 'Settings', key: 'settings' as const },
];

export default function CompanySidebar({ locale, active }: CompanySidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 p-4 hidden sm:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href(locale)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active === link.key
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
