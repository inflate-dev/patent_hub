import { CategoryKey } from '@/lib/i18n/dictionaries';
import { NotionArticle } from '@/lib/notion/types';
import { getMockArticles } from '@/lib/notion/client';

const notionToken = process.env.NEXT_PUBLIC_NOTION_TOKEN; 
const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;

export async function fetchNotionArticles(
  category?: CategoryKey,
  locale?: string
): Promise<NotionArticle[]> {
  if (!notionToken || !databaseId) return [];

  const filters: any[] = [];

  if (category && category !== 'all') {
    filters.push({
      property: 'Category',
      select: { equals: category },
    });
  }

  if (locale) {
    filters.push({
      property: 'Language',
      select: { equals: locale },
    });
  }

  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter:
          filters.length === 0
            ? undefined
            : filters.length === 1
            ? filters[0]
            : { and: filters },
        sorts: [
          {
            property: 'Published Date',
            direction: 'descending',
          },
        ],
      }),
    }
  );

  const data = await res.json();
  return data.results.map(parseNotionPage);
}

export async function getNotionArticle(pageId: string): Promise<NotionArticle | null> {
  if (!notionToken || !databaseId) {
    return getMockArticles().find((a) => a.id === pageId) || null;
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({
        filter: {
          property: 'Title',
          title: {
            is_not_empty: true, // ← 全件取得のためのダミー条件
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch page from Notion');
    }

    const data = await response.json();
    const page = data.results.find((page: any) => page.id === pageId);
    if (!page) {
      return null;
    }

    return parseNotionPage(page);
  } catch (error) {
    console.error('Error fetching page from Notion:', error);
    return null;
  }
}

function parseNotionPage(page: any): NotionArticle {
  const p = page.properties;

  const titleData = p.Title?.rich_text?.[0]?.plain_text ? JSON.parse(p.Title.rich_text[0].plain_text) : { ja: '', en: '', zh: '' };
  const summaryData = p.Summary?.rich_text?.[0]?.plain_text ? JSON.parse(p.Summary.rich_text[0].plain_text) : {
    ja: { overview: '', properties: [] },
    en: { overview: '', properties: [] },
    zh: { overview: '', properties: [] }
  };

  return {
    id: page.id,
    title_ja: titleData.ja ?? '',
    title_en: titleData.en ?? '',
    title_zh: titleData.zh ?? '',
    Overview_ja: summaryData.ja?.overview ?? '',
    Overview_en: summaryData.en?.overview ?? '',
    Overview_zh: summaryData.zh?.overview ?? '',
    Properties_ja: summaryData.ja?.properties ?? [],
    Properties_en: summaryData.en?.properties ?? [],
    Properties_zh: summaryData.zh?.properties ?? [],
    coverImage:
      page.cover?.external?.url ??
      page.cover?.file?.url ??
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedDate: p.FilingDate?.date?.start ?? '',
    tags: p.Tags?.multi_select?.map((t: any) => t.name) ?? [],
    author: p.Applicant?.rich_text?.[0]?.plain_text ?? '',
    category: p.Category?.select?.name,
  };
}
