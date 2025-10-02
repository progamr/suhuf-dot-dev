import { ENDPOINTS } from '@/infrastructure/constants/api';
import { Author } from '@/types/onboarding';

export async function getAuthorsRequest(limit: number = 50): Promise<Author[]> {
  const response = await fetch(`${ENDPOINTS.AUTHORS}?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch authors');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch authors');
  }
  
  return data.data;
}
