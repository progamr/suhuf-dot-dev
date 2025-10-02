import { NewsApiClient, NewsApiResponse, FetchNewsParams, NewsArticle } from './types';

interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
    byline?: string;
  };
  sectionName?: string;
}

interface GuardianResponse {
  response: {
    status: string;
    results: GuardianArticle[];
    total?: number;
  };
}

export class GuardianClient implements NewsApiClient {
  private apiKey: string;
  private baseUrl = 'https://content.guardianapis.com';
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.apiKey = process.env.GUARDIAN_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Guardian API key not configured');
    }
  }

  getSourceIdentifier(): string {
    return 'guardian';
  }

  async fetchNews(params: FetchNewsParams): Promise<NewsApiResponse> {
    const url = new URL(`${this.baseUrl}/search`);
    
    url.searchParams.append('api-key', this.apiKey);
    url.searchParams.append('show-fields', 'thumbnail,trailText,byline');
    url.searchParams.append('page-size', String(params.pageSize || 20));
    url.searchParams.append('page', String(params.page || 1));
    
    if (params.query) {
      url.searchParams.append('q', params.query);
    }
    
    if (params.category) {
      url.searchParams.append('section', params.category);
    }
    
    if (params.from) {
      url.searchParams.append('from-date', params.from);
    }
    
    if (params.to) {
      url.searchParams.append('to-date', params.to);
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
          console.log(`Guardian API rate limited. Retrying in ${delay}ms... (attempt ${attempt}/${this.maxRetries})`);
          await this.sleep(delay);
          return this.fetchWithRetry(url, attempt + 1);
        }
        throw new Error('Guardian API rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`Guardian API error: ${response.status} ${response.statusText}`);
      }

      const data: GuardianResponse = await response.json();
      
      return {
        articles: data.response.results
          .filter(article => article.webTitle && article.fields?.trailText)
          .map(this.transformArticle.bind(this)),
        totalResults: data.response.total,
      };
    } catch (error) {
      if (attempt < this.maxRetries && this.isRetryableError(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        console.log(`Guardian API error. Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.fetchWithRetry(url, attempt + 1);
      }
      console.error('Error fetching from Guardian API:', error);
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

  private transformArticle(article: GuardianArticle): NewsArticle {
    return {
      externalId: article.id,
      title: article.webTitle,
      description: article.fields?.trailText || '',
      url: article.webUrl,
      imageUrl: article.fields?.thumbnail,
      publishedAt: new Date(article.webPublicationDate),
      author: article.fields?.byline,
      source: this.getSourceIdentifier(),
      categories: article.sectionName ? [article.sectionName] : [],
    };
  }
}
