import { ArticlesList } from '@/modules/feed/components/ArticlesList';

export const metadata = {
  title: 'Articles - Suhuf',
  description: 'Browse and search news articles from multiple sources',
};

export default function ArticlesPage() {
  return <ArticlesList />;
}
