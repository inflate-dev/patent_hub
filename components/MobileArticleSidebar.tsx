'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { NotionArticle } from '@/lib/notion/types';
import { cn } from '@/lib/utils';
import { FileText, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MobileArticleSidebarProps {
  articles: NotionArticle[];
  currentArticleId: string;
  categoryName: string;
}

export function MobileArticleSidebar({ articles, currentArticleId, categoryName }: MobileArticleSidebarProps) {
  const { dictionary, locale } = useLanguage();
  const [open, setOpen] = useState(false);

  const getLocalizedTitle = (article: NotionArticle) => {
    if (locale === 'ja') return article.title_ja;
    if (locale === 'zh') return article.title_zh;
    return article.title_en;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden mb-4">
          <Menu className="h-4 w-4 mr-2" />
          {dictionary.sidebar?.relatedArticles || 'Related Articles'}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {dictionary.sidebar?.relatedArticles || 'Related Articles'}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            {categoryName}
          </p>

          <nav className="space-y-2">
            {articles.map((article) => {
              const isActive = article.id === currentArticleId;

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <div className="line-clamp-2">
                    {getLocalizedTitle(article)}
                  </div>
                  {article.author && (
                    <div className={cn(
                      'text-xs mt-1',
                      isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}>
                      {article.author}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {articles.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {dictionary.sidebar?.noArticles || 'No articles available'}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
