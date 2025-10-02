import { NewsApiClient } from './types';
import { GuardianClient } from './guardianClient';
import { NewsApiOrgClient } from './newsApiClient';
import { NYTimesClient } from './nyTimesClient';

export class NewsClientFactory {
  private static clients: Map<string, NewsApiClient> = new Map();

  static getClient(source: string): NewsApiClient {
    if (!this.clients.has(source)) {
      this.clients.set(source, this.createClient(source));
    }
    return this.clients.get(source)!;
  }

  static getAllClients(): NewsApiClient[] {
    return [
      this.getClient('guardian'),
      this.getClient('newsapi'),
      this.getClient('nytimes'),
    ];
  }

  private static createClient(source: string): NewsApiClient {
    switch (source) {
      case 'guardian':
        return new GuardianClient();
      case 'newsapi':
        return new NewsApiOrgClient();
      case 'nytimes':
        return new NYTimesClient();
      default:
        throw new Error(`Unknown news source: ${source}`);
    }
  }
}
