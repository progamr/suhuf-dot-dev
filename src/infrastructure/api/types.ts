// Common types for all news API clients

export interface NewsArticle {
  externalId: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  author?: string;
  source: string;
  categories: string[];
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  totalResults?: number;
}

export interface FetchNewsParams {
  category?: string;
  query?: string;
  from?: string;
  to?: string;
  pageSize?: number;
  page?: number;
}

export interface NewsApiClient {
  fetchNews(params: FetchNewsParams): Promise<NewsApiResponse>;
  getSourceIdentifier(): string;
}
