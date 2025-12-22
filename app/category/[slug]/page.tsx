'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { NotionArticle } from '@/lib/notion/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { MainLayout } from '@/components/MainLayout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CategoryKey } from '@/lib/i18n/dictionaries';

export default function CategoryPage() {
  const params = useParams();
  const category = params.slug as CategoryKey;
  const { locale, dictionary } = useLanguage();
  const [articles, setArticles] = useState<NotionArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NotionArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!category || !locale) return;
    loadArticles();
  }, [category, locale]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredArticles(filtered);
    } else {
      setFilteredArticles(articles);
    }
  }, [searchQuery, articles]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?category=${category}&locale=${locale}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data: NotionArticle[] = await res.json();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              {dictionary.categories[category]}
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder={dictionary.articles.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">{dictionary.articles.loading}</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">{dictionary.articles.noResults}</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
