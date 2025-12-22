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
      title: 'Quantum Computing Patent Breakthrough',
      description: 'A revolutionary approach to quantum error correction has been patented, promising to reduce computational errors significantly.',
      content: 'Recent developments in quantum computing have led to a groundbreaking patent for error correction algorithms. This innovation promises to significantly reduce computational errors in quantum systems, making practical quantum computing more achievable.\n\nThe patent describes a novel method for detecting and correcting errors in quantum bits (qubits) without destroying their quantum state. This is crucial because quantum systems are extremely sensitive to environmental disturbances, and maintaining coherence is one of the biggest challenges in building practical quantum computers.\n\nThe new approach uses a combination of redundant encoding and real-time monitoring to identify errors as they occur. Unlike previous methods, this system can correct errors faster than they accumulate, potentially allowing quantum computers to perform complex calculations that were previously impossible.\n\nResearchers believe this breakthrough could accelerate the development of quantum computers capable of solving problems in cryptography, drug discovery, and materials science that are beyond the reach of classical computers.',
      coverImage: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1200',
      publishedDate: '2025-12-01',
      tags: ['Quantum Computing', 'Innovation', 'Technology'],
      author: 'Dr. Sarah Chen',
      language: 'en',
      category: 'carbon',
    },
  ];

  let filtered = articles;

  if (category && category !== 'all') {
    filtered = filtered.filter(article => article.category === category);
  }

  if (locale) {
    filtered = filtered.filter(article => article.language === locale);
  }

  return filtered;
}
