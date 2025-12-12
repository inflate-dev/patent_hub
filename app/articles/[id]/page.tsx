'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getNotionArticle, getNotionArticles, NotionArticle } from '@/lib/notion/client';
import { canViewArticle, addViewedArticle, getViewedArticlesCount } from '@/lib/articleViews';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleRestrictionScreen } from '@/components/ArticleRestrictionScreen';
import { ArticleSidebar } from '@/components/ArticleSidebar';
import { MobileArticleSidebar } from '@/components/MobileArticleSidebar';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const { locale, dictionary } = useLanguage();
  const [article, setArticle] = useState<NotionArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NotionArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    if (params.id && !authLoading) {
      checkAccessAndLoadArticle(params.id as string);
    }
  }, [params.id, user, authLoading]);

  const checkAccessAndLoadArticle = async (id: string) => {
    setLoading(true);

    const hasAccess = canViewArticle(id, !!user);
    setCanView(hasAccess);

    if (hasAccess) {
      try {
        const data = await getNotionArticle(id);
        setArticle(data);

        if (data) {
          const related = await getNotionArticles(data.category, locale);
          setRelatedArticles(related);
        }

        if (!user) {
          addViewedArticle(id);
        }
      } catch (error) {
        console.error('Error loading article:', error);
      }
    }

    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-12">
          <Link href={article?.category ? `/category/${article.category}` : '/'}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {article?.category ? dictionary.categories[article.category] : 'Back to Home'}
            </Button>
          </Link>
          <ArticleRestrictionScreen />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Article not found</p>
          <Link href="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex">
        <div className="hidden lg:block">
          <ArticleSidebar
            articles={relatedArticles}
            currentArticleId={article.id}
            categoryName={dictionary.categories[article.category]}
          />
        </div>

        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
              <Link href={`/category/${article.category}`}>
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {dictionary.categories[article.category]}
                </Button>
              </Link>

              <div className="mb-4">
                <MobileArticleSidebar
                  articles={relatedArticles}
                  currentArticleId={article.id}
                  categoryName={dictionary.categories[article.category]}
                />
              </div>
            </div>

            <Card className="overflow-hidden">
            <div className="relative w-full h-96">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>

            <CardHeader className="space-y-6 pt-8">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-12">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 leading-relaxed text-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>

              {!user && (
                <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-semibold mb-2">Enjoying this article?</h3>
                  <p className="text-muted-foreground mb-4">
                    Sign up to unlock unlimited access to all our premium patent articles and insights.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/signup">
                      <Button>Sign Up Free</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline">Log In</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
