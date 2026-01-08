'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { NotionArticle } from '@/lib/notion/types';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';

interface ArticleSidebarProps {
  articles: NotionArticle[];
  currentArticleId: string;
  categoryName: string;
}

export function ArticleSidebar({ articles, currentArticleId, categoryName }: ArticleSidebarProps) {
  const { dictionary, locale } = useLanguage();

  const getLocalizedTitle = (article: NotionArticle) => {
    if (locale === 'ja') return article.title_ja;
    if (locale === 'zh') return article.title_zh;
    return article.title_en;
  };

  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="sticky top-20 p-6 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">
            {dictionary.sidebar?.relatedArticles || 'Related Articles'}
          </h2>
        </div>

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
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'
                )}
              >
                <div className="line-clamp-2">
                  {getLocalizedTitle(article)}
                </div>
                {article.Applicant && (
                  <div className={cn(
                    'text-xs mt-1',
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}>
                    {article.Applicant}
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
    </aside>
  );
}
