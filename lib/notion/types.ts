import { CategoryKey } from '@/lib/i18n/dictionaries';

export interface NotionArticle {
  id: string;
  title_ja: string;
  title_en: string;
  title_zh: string;
  Overview_ja: string;
  Overview_en: string;
  Overview_zh: string;
  Properties_ja: string[];
  Properties_en: string[];
  Properties_zh: string[];
  coverImage: string;
  publishedDate: string;
  title_number: string;
  tags: string[];
  Applicant: string;
  category: CategoryKey;
}
