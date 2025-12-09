const VIEWED_ARTICLES_KEY = 'viewedArticles';

export function getViewedArticles(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(VIEWED_ARTICLES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addViewedArticle(articleId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const viewed = getViewedArticles();
    if (!viewed.includes(articleId)) {
      viewed.push(articleId);
      localStorage.setItem(VIEWED_ARTICLES_KEY, JSON.stringify(viewed));
    }
  } catch (error) {
    console.error('Error saving viewed article:', error);
  }
}

export function hasViewedArticle(articleId: string): boolean {
  return getViewedArticles().includes(articleId);
}

export function getViewedArticlesCount(): number {
  return getViewedArticles().length;
}

export function canViewArticle(articleId: string, isLoggedIn: boolean): boolean {
  if (isLoggedIn) return true;

  const viewedCount = getViewedArticlesCount();
  const hasViewed = hasViewedArticle(articleId);

  return hasViewed || viewedCount < 1;
}
