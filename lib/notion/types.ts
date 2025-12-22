import { CategoryKey } from '@/lib/i18n/dictionaries';

export interface NotionArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  publishedDate: string;
  tags: string[];
  author: string;
  language: string;
  category: CategoryKey;
}
