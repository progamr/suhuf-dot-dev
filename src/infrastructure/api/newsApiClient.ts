import { NewsApiClient, NewsApiResponse, FetchNewsParams, NewsArticle } from './types';

interface NewsApiArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiOrgResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export class NewsApiOrgClient implements NewsApiClient {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.apiKey = process.env.NEWSAPI_KEY || '';
    if (!this.apiKey) {
      console.warn('NewsAPI key not configured');
    }
  }

  getSourceIdentifier(): string {
    return 'newsapi';
  }

  async fetchNews(params: FetchNewsParams): Promise<NewsApiResponse> {
    const url = new URL(`${this.baseUrl}/top-headlines`);
    
    url.searchParams.append('apiKey', this.apiKey);
    url.searchParams.append('pageSize', String(params.pageSize || 20));
    url.searchParams.append('page', String(params.page || 1));
    url.searchParams.append('language', 'en');
    
    if (params.query) {
      url.searchParams.append('q', params.query);
    }
    
    if (params.category) {
      url.searchParams.append('category', params.category);
    }

    return this.fetchWithRetry(url.toString());
  }

  private async fetchWithRetry(url: string, attempt = 1): Promise<NewsApiResponse> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Suhuf News Aggregator',
        },
      });
      
      // Handle rate limiting
      if (response.status === 429) {
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          console.log(`NewsAPI rate limited. Retrying in ${delay}ms... (attempt ${attempt}/${this.maxRetries})`);
          await this.sleep(delay);
          return this.fetchWithRetry(url, attempt + 1);
        }
        throw new Error('NewsAPI rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
      }

      const data: NewsApiOrgResponse = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('NewsAPI returned error status');
      }
      
      return {
        articles: data.articles
          .filter(article => article.title && article.description)
          .map(this.transformArticle.bind(this)),
        totalResults: data.totalResults,
      };
    } catch (error) {
      if (attempt < this.maxRetries && this.isRetryableError(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        console.log(`NewsAPI error. Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.fetchWithRetry(url, attempt + 1);
      }
      console.error('Error fetching from NewsAPI:', error);
      throw error;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('fetch') || 
             error.message.includes('timeout') ||
             error.message.includes('500') ||
             error.message.includes('502') ||
             error.message.includes('503');
    }
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private transformArticle(article: NewsApiArticle): NewsArticle {
    return {
      externalId: `${article.source.id || article.source.name}-${Date.parse(article.publishedAt)}`,
      title: article.title,
      description: article.description || '',
      url: article.url,
      imageUrl: article.urlToImage || undefined,
      publishedAt: new Date(article.publishedAt),
      author: article.author || undefined,
      source: this.getSourceIdentifier(),
      categories: [], // NewsAPI doesn't provide categories in response
    };
  }
}
