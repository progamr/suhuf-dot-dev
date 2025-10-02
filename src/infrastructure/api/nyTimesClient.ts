import { NewsApiClient, NewsApiResponse, FetchNewsParams, NewsArticle } from './types';

interface NYTimesArticle {
  uri: string;
  url: string;
  title: string;
  abstract: string;
  published_date: string;
  byline?: string;
  section?: string;
  subsection?: string;
  multimedia?: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
  }>;
}

interface NYTimesResponse {
  status: string;
  copyright: string;
  section: string;
  last_updated: string;
  num_results: number;
  results: NYTimesArticle[];
}

export class NYTimesClient implements NewsApiClient {
  private apiKey: string;
  private baseUrl = 'https://api.nytimes.com/svc/topstories/v2';
  private maxRetries = 3;
  private retryDelay = 1000;
  private sections = ['home', 'world', 'us', 'politics', 'business', 'technology', 'science'];

  constructor() {
    this.apiKey = process.env.NYTIMES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('NY Times API key not configured');
    }
  }

  getSourceIdentifier(): string {
    return 'nytimes';
  }

  async fetchNews(_params: FetchNewsParams): Promise<NewsApiResponse> {
    if (!this.apiKey) {
      console.error('NY Times API key is not set!');
      throw new Error('NY Times API key is not configured');
    }
    
    // Fetch from home section to get top stories
    const url = new URL(`${this.baseUrl}/home.json`);
    url.searchParams.append('api-key', this.apiKey);

    console.log('NY Times: Fetching from', url.toString().replace(this.apiKey, 'HIDDEN'));
    return this.fetchWithRetry(url.toString());
  }

  private async fetchWithRetry(url: string, attempt = 1): Promise<NewsApiResponse> {
    try {
      const response = await fetch(url);
      
      // Handle rate limiting
      if (response.status === 429) {
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          console.log(`NY Times API rate limited. Retrying in ${delay}ms... (attempt ${attempt}/${this.maxRetries})`);
          await this.sleep(delay);
          return this.fetchWithRetry(url, attempt + 1);
        }
        throw new Error('NY Times API rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`NY Times API error: ${response.status} ${response.statusText}`);
      }

      const data: NYTimesResponse = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error('NY Times API returned error status');
      }

      if (!data.results || data.results.length === 0) {
        return {
          articles: [],
          totalResults: 0,
        };
      }
      
      return {
        articles: data.results
          .filter(article => article.title && article.abstract)
          .map(article => this.transformArticle(article)),
        totalResults: data.num_results,
      };
    } catch (error) {
      if (attempt < this.maxRetries && this.isRetryableError(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        console.log(`NY Times API error. Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.fetchWithRetry(url, attempt + 1);
      }
      console.error('Error fetching from NY Times API:', error);
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

  private transformArticle(article: NYTimesArticle): NewsArticle {
    // Handle multimedia - find the best quality image
    let imageUrl: string | undefined;
    if (Array.isArray(article.multimedia) && article.multimedia.length > 0) {
      // Prefer larger formats
      const image = article.multimedia.find(m => 
        m.format === 'superJumbo' || m.format === 'threeByTwoSmallAt2X'
      ) || article.multimedia[0];
      imageUrl = image?.url;
    }
    
    // Build categories from section and subsection
    const categories: string[] = [];
    if (article.section) {
      categories.push(article.section);
    }
    if (article.subsection && article.subsection !== article.section) {
      categories.push(article.subsection);
    }
    
    return {
      externalId: article.uri,
      title: article.title,
      description: article.abstract,
      url: article.url,
      imageUrl,
      publishedAt: new Date(article.published_date),
      author: article.byline || 'The New York Times',
      source: this.getSourceIdentifier(),
      categories,
    };
  }
}
