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

  const filter = category && category !== 'all'
    ? {
        property: 'Category',
        select: { equals: category },
      }
    : undefined;

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
        filter,
        sorts: [
          {
            property: 'FilingDate',
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
          property: 'Category',
          select: {
            is_not_empty: true,
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

  const parsePropertiesField = (field: any): string[] => {
    if (!field) return [];
    const text = field.rich_text?.[0]?.plain_text ?? '';
    if (!text) return [];
    return text.split('\n').filter((line: string) => line.trim() !== '');
  };

  return {
    id: page.id,
    title_ja: p.title_ja?.rich_text?.[0]?.plain_text ?? '',
    title_en: p.title_en?.rich_text?.[0]?.plain_text ?? '',
    title_zh: p.title_zh?.rich_text?.[0]?.plain_text ?? '',
    Overview_ja: p.Overview_ja?.rich_text?.[0]?.plain_text ?? '',
    Overview_en: p.Overview_en?.rich_text?.[0]?.plain_text ?? '',
    Overview_zh: p.Overview_zh?.rich_text?.[0]?.plain_text ?? '',
    Properties_ja: parsePropertiesField(p.Properties_ja),
    Properties_en: parsePropertiesField(p.Properties_en),
    Properties_zh: parsePropertiesField(p.Properties_zh),
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
