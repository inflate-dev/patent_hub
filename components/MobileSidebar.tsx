'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategoryKey, categoryKeys } from '@/lib/i18n/dictionaries';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  const getIsActive = (category: CategoryKey) => {
    if (category === 'all') {
      return pathname === '/';
    }
    return pathname === `/category/${category}`;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            {dictionary.sidebar.title}
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6 space-y-1">
          {categoryKeys.map((category) => (
            <Link
              key={category}
              href={category === 'all' ? '/' : `/category/${category}`}
              onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
}
