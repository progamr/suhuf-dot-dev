import { NewsApiClient, NewsApiResponse, FetchNewsParams, NewsArticle } from './types';

interface BBCArticle {
  title: string;
  summary: string;
  image_link: string;
  news_link: string;
}

interface BBCResponse {
  status: number;
  latest: BBCArticle[];
  elapsed_time: string;
  timestamp: number;
}

export class BBCNewsClient implements NewsApiClient {
  private baseUrl = 'https://bbc-news-api.vercel.app';
  private maxRetries = 3;
  private retryDelay = 1000;

  getSourceIdentifier(): string {
    return 'bbc';
  }

  async fetchNews(_params: FetchNewsParams): Promise<NewsApiResponse> {
    const url = new URL(`${this.baseUrl}/news`);
    url.searchParams.append('lang', 'english');

    return this.fetchWithRetry(url.toString());
  }

  private async fetchWithRetry(url: string, attempt = 1): Promise<NewsApiResponse> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (this.isRetryableError(response.status) && attempt < this.maxRetries) {
          await this.sleep(this.retryDelay * attempt);
          return this.fetchWithRetry(url, attempt + 1);
        }
        throw new Error(`BBC News API error: ${response.status} ${response.statusText}`);
      }

      const data: BBCResponse = await response.json();

      if (!data.latest || data.latest.length === 0) {
        return {
          articles: [],
          totalResults: 0,
        };
      }

      const articles = data.latest
        .filter(article => article.title && article.news_link)
        .map(article => this.transformArticle(article));

      return {
        articles,
        totalResults: articles.length,
      };
    } catch (error) {
      if (attempt < this.maxRetries && this.isNetworkError(error)) {
        await this.sleep(this.retryDelay * attempt);
        return this.fetchWithRetry(url, attempt + 1);
      }
      throw error;
    }
  }

  private transformArticle(article: BBCArticle): NewsArticle {
    // Generate a unique ID from the URL
    const urlParts = article.news_link.split('/');
    const externalId = urlParts[urlParts.length - 1] || article.news_link;

    return {
      externalId: `bbc-${externalId}`,
      title: article.title,
      description: article.summary || article.title,
      url: article.news_link,
      imageUrl: article.image_link || undefined,
      publishedAt: new Date(), // BBC API doesn't provide timestamp per article
      author: 'BBC News',
      source: this.getSourceIdentifier(),
      categories: [], // BBC API doesn't provide categories in this endpoint
    };
  }

  private isRetryableError(status: number): boolean {
    return status === 429 || status === 503 || status >= 500;
  }

  private isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.includes('fetch') ||
             error.message.includes('network') ||
             error.message.includes('ECONNREFUSED') ||
             error.message.includes('ETIMEDOUT');
    }
    return false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
