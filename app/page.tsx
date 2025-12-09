'use client';

import { useEffect, useState } from 'react';
import { getNotionArticles, NotionArticle } from '@/lib/notion/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Home() {
  const { locale } = useLanguage();
  const [articles, setArticles] = useState<NotionArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NotionArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

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
      const data = await getNotionArticles();
      setArticles(data);
      setFilteredArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Patent Innovation Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover groundbreaking patents and innovations from around the world
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="search"
              placeholder="Search articles by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No articles found</p>
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
    </div>
  );
}
