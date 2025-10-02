import { ENDPOINTS } from '@/infrastructure/constants/api';
import { Category } from '@/types/feed';

export async function getCategoriesRequest(): Promise<Category[]> {
  const response = await fetch(ENDPOINTS.CATEGORIES);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch categories');
  }
  
  return data.data;
}
