import Link from 'next/link';
import Image from 'next/image';
import { NotionArticle } from '@/lib/notion/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface ArticleCardProps {
  article: NotionArticle;
  locale: string;
}

export function ArticleCard({ article, locale }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedDate).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : locale === 'zh' ? 'zh-CN' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-80 h-48 md:h-auto flex-shrink-0 overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h2>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {article.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
              <span>•</span>
              <span>{article.author}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
