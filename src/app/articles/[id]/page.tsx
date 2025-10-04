import { ArticleDetail } from '@/modules/feed/components/ArticleDetail';

interface ArticleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const resolvedParams = await params;
  return <ArticleDetail articleId={resolvedParams.id} />;
}
