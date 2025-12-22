// app/api/article/[id]/route.ts
import { getNotionArticle } from '@/lib/notion/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const article = await getNotionArticle(params.id);
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json(article);
}
