'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategoryKey, categoryKeys } from '@/lib/i18n/dictionaries';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  const getIsActive = (category: CategoryKey) => {
    if (category === 'all') {
      return pathname === '/';
    }
    return pathname === `/category/${category}`;
  };

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="sticky top-16 p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">{dictionary.sidebar.title}</h2>
          </div>

          <nav className="space-y-1">
            {categoryKeys.map((category) => (
              <Link
                key={category}
                href={category === 'all' ? '/' : `/category/${category}`}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  getIsActive(category)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {dictionary.categories[category]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
