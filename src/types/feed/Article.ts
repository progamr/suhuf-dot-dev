export interface Article {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
    slug: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  author?: {
    id: string;
    name: string;
  } | null;
}
