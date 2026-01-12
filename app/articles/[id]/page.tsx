'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NotionArticle } from '@/lib/notion/types';
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
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) {
          throw new Error('Not found');
        }
        const data = await res.json();
        setArticle(data);

        if (data) {
          const relatedRes = await fetch(`/api/articles?category=${data.category}&locale=${locale}`);
          const related = await relatedRes.json();
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

  const getLocalizedTitle = () => {
    if (locale === 'ja') return article.title_ja;
    if (locale === 'zh') return article.title_zh;
    return article.title_en;
  };

  const getLocalizedOverview = () => {
    if (locale === 'ja') return article.Overview_ja;
    if (locale === 'zh') return article.Overview_zh;
    return article.Overview_en;
  };

  const getLocalizedProperties = () => {
    if (locale === 'ja') return article.Properties_ja;
    if (locale === 'zh') return article.Properties_zh;
    return article.Properties_en;
  };

  const title = getLocalizedTitle();
  const overview = getLocalizedOverview();
  const properties = getLocalizedProperties();

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
                  alt={title}
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
                {title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {overview}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{article.Applicant}</span>
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
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">
                    {locale === 'ja' ? '概要' : locale === 'zh' ? '概述' : 'Overview'}
                  </h2>
                  <p className="mb-6 leading-relaxed text-foreground">
                    {overview}
                  </p>
                </div>

                {properties.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      {locale === 'ja' ? '特性' : locale === 'zh' ? '特性' : 'Properties'}
                    </h2>
                    <ul className="list-disc list-inside space-y-2">
                      {properties.map((property, index) => (
                        <li key={index} className="leading-relaxed text-foreground">
                          {property}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
