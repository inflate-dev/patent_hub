// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchNotionArticles } from '@/lib/notion/server';
import { CategoryKey } from '@/lib/i18n/dictionaries';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rawCategory = searchParams.get('category') || undefined;
  const rawLocale = searchParams.get('locale') || undefined;

  const category = rawCategory as CategoryKey | undefined;
  const locale = rawLocale ?? undefined;
  try {
    const articles = await fetchNotionArticles(category, locale);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}
