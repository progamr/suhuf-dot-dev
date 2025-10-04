import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';
import { FileQuestion } from 'lucide-react';

export default function ArticleNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={false} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="text-center space-y-6 max-w-md">
          <FileQuestion className="h-24 w-24 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
            <Link href="/articles">
              <Button variant="outline">Browse Articles</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
