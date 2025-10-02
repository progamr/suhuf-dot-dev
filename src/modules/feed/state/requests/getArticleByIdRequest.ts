import { ENDPOINTS } from '@/infrastructure/constants/api';
import { Article } from '@/types/feed';

export async function getArticleByIdRequest(articleId: string): Promise<Article> {
  const response = await fetch(ENDPOINTS.ARTICLE_BY_ID(articleId));
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Article not found');
    }
    throw new Error('Failed to fetch article');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch article');
  }
  
  return data.data;
}
