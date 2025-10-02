import { ArticleDetailClient } from './ArticleDetailClient';

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  return <ArticleDetailClient articleId={params.id} />;
}
