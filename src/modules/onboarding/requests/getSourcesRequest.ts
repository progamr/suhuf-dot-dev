import { ENDPOINTS } from '@/infrastructure/constants/api';
import { Source } from '@/types/onboarding';

export async function getSourcesRequest(): Promise<Source[]> {
  const response = await fetch(ENDPOINTS.SOURCES);
  
  if (!response.ok) {
    throw new Error('Failed to fetch sources');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch sources');
  }
  
  return data.data;
}
