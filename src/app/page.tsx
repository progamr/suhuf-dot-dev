import { auth } from '@/infrastructure/auth/auth';
import { FeedRouter } from '@/modules/feed/components/FeedRouter';
import { PublicFeed } from '@/modules/feed/components/PublicFeed/';

export default async function HomePage() {
  const session = await auth();

  // If not logged in, show public feed
  if (!session?.user?.id) {
    return <PublicFeed />;
  }

  // Authenticated - FeedRouter will check onboarding and redirect if needed
  return <FeedRouter />;
}
