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

  const rt = (x: any) => x?.rich_text?.[0]?.plain_text ?? "";
  const title = (x: any) => x?.title?.[0]?.plain_text ?? "";
  const parsePropertiesField = (field: any): string[] => {
    const text = rt(field);
    return text ? text.split("\n").map((s: string) => s.trim()).filter(Boolean) : [];
  };

  const coverUrl = p["coverImage"]?.url ?? "";

  return {
    id: page.id,
    title_en: title(p["Title"]),
    title_ja: rt(p["Title_ja"]),
    title_zh: rt(p["Title_zh"]),
    Overview_ja: rt(p["Overview_ja"]),
    Overview_en: rt(p["Overview_en"]),
    Overview_zh: rt(p["Overview_zh"]),
    Properties_ja: parsePropertiesField(p["Properties_ja"]),
    Properties_en: parsePropertiesField(p["Properties_en"]),
    Properties_zh: parsePropertiesField(p["Properties_zh"]),
    Applicant: rt(p["Applicant"]),
    category: p["Category"]?.select?.name,
    tags: p["Tags"]?.multi_select?.map((t: any) => t.name) ?? [],

    // ✅ 日付列は "Published Date"
    publishedDate: p["Published Date"]?.date?.start ?? "",
    // ✅ title_number は専用列
    title_number: rt(p["title_number"]),
    coverImage:
      coverUrl ||
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
  };
}
