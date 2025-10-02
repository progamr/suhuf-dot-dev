import { ENDPOINTS } from '@/infrastructure/constants/api';
import { FeedData } from '@/types/feed';

export async function getPublicFeedRequest(): Promise<FeedData> {
  const response = await fetch(ENDPOINTS.FEED_PUBLIC);
  
  if (!response.ok) {
    throw new Error('Failed to fetch public feed');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch feed');
  }
  
  return data.data;
}
