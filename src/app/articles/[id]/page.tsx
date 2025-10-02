import { ArticleDetail } from '@/modules/feed/components/ArticleDetail';

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  return <ArticleDetail articleId={params.id} />;
}
