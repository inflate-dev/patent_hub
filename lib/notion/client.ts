import { CategoryKey } from '@/lib/i18n/dictionaries';
import { NotionArticle } from '@/lib/notion/types';

// Fetch articles from the API　もし今後使うなら
export async function getArticles(): Promise<NotionArticle[]> {
  const res = await fetch('/api/articles');
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function getNotionArticle(id: string): Promise<NotionArticle | null> {
  const res = await fetch(`/api/articles/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

export function getMockArticles(category?: CategoryKey, locale?: string): NotionArticle[] {
  const articles: NotionArticle[] = [
    {
      id: '1',
      title_ja: '量子コンピューティング特許のブレークスルー',
      title_en: 'Quantum Computing Patent Breakthrough',
      title_zh: '量子计算专利突破',
      Overview_ja: '量子エラー訂正への革新的なアプローチが特許取得され、計算エラーを大幅に削減することが期待されています。',
      Overview_en: 'A revolutionary approach to quantum error correction has been patented, promising to reduce computational errors significantly.',
      Overview_zh: '一种革命性的量子纠错方法已获得专利，有望显著减少计算错误。',
      Properties_ja: ['量子ビットエラー訂正', 'リアルタイム監視システム', '冗長エンコーディング'],
      Properties_en: ['Quantum bit error correction', 'Real-time monitoring system', 'Redundant encoding'],
      Properties_zh: ['量子比特纠错', '实时监控系统', '冗余编码'],
      coverImage: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-12-01',
      title_number: '2025-12-01',
      tags: ['Quantum Computing', 'Innovation', 'Technology'],
      Applicant: 'Dr. Sarah Chen',
      category: 'carbon',
    },
  ];

  let filtered = articles;

  if (category && category !== 'all') {
    filtered = filtered.filter(article => article.category === category);
  }

  return filtered.sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });
}
