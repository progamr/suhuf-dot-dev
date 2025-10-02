# Development Guide

## Overview

This guide covers development setup, coding conventions, and best practices for contributing to Suhuf.

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone repository:**

```bash
git clone <repository-url>
cd suhuf-dev
```

2. **Install dependencies:**

```bash
npm install
```

3. **Setup environment:**

```bash
cp .env.example .env
```

Edit `.env` with your local configuration:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/suhuf_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key-min-32-chars
# ... other variables
```

4. **Setup database:**

```bash
# Create database
createdb suhuf_dev

# Run migrations
npm run migration:up

# Run initial sync (optional)
npm run sync:initial
```

5. **Start development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
suhuf-dev/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   ├── (main)/            # Main app route group
│   │   ├── api/               # API routes
│   │   ├── ui/                # Shared UI components
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── modules/               # Feature modules
│   │   ├── auth/
│   │   │   ├── components/    # Auth-specific components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── queries/       # TanStack Query queries
│   │   │   ├── services/      # Business logic
│   │   │   ├── utils/         # Utility functions
│   │   │   └── consts/        # Constants
│   │   ├── news/
│   │   └── user/
│   ├── lib/                   # Shared libraries
│   │   ├── db/                # Database config
│   │   ├── auth/              # Auth config
│   │   ├── api/               # External API clients
│   │   ├── middleware/        # Custom middleware
│   │   └── utils/             # Global utilities
│   ├── entities/              # MikroORM entities
│   └── types/                 # TypeScript types
├── scripts/                   # Utility scripts
├── docs/                      # Documentation
├── docker/                    # Docker files
├── public/                    # Static assets
└── tests/                     # Test files
```

---

## Coding Conventions

### File Naming

- **Components**: PascalCase with `.tsx` extension
  - `ArticleCard.tsx`
  - `LoginForm.tsx`
  
- **Hooks**: camelCase starting with `use`
  - `useAuth.ts`
  - `useArticles.ts`
  
- **Services**: camelCase with `Service` suffix
  - `authService.ts`
  - `newsService.ts`
  
- **Utils**: camelCase
  - `validation.ts`
  - `helpers.ts`
  
- **Constants**: camelCase with `Consts` suffix
  - `authConsts.ts`
  - `newsConsts.ts`

### TypeScript Conventions

**Use explicit types:**

```typescript
// ✅ Good
function getUser(id: string): Promise<User> {
  return db.user.findOne({ id });
}

// ❌ Avoid
function getUser(id) {
  return db.user.findOne({ id });
}
```

**Use interfaces for objects:**

```typescript
interface ArticleCardProps {
  article: Article;
  onFavorite?: (id: string) => void;
  className?: string;
}
```

**Use type for unions/intersections:**

```typescript
type Theme = 'light' | 'dark' | 'system';
type ArticleWithSource = Article & { source: Source };
```

### Component Structure

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { useArticles } from '../hooks/useArticles';

// Types/Interfaces
interface ArticleListProps {
  initialArticles?: Article[];
  categoryId?: string;
}

// Component
export function ArticleList({ initialArticles, categoryId }: ArticleListProps) {
  // Hooks
  const [page, setPage] = useState(1);
  const { data, isLoading } = useArticles({ categoryId, page });
  
  // Handlers
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  // Render helpers
  const renderArticle = (article: Article) => (
    <ArticleCard key={article.id} article={article} />
  );
  
  // Early returns
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <EmptyState />;
  
  // Main render
  return (
    <div className="space-y-4">
      {data.items.map(renderArticle)}
      {data.hasMore && (
        <Button onClick={handleLoadMore}>Load More</Button>
      )}
    </div>
  );
}
```

### API Route Structure

```typescript
// src/app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Validation schema
const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
});

// GET handler
export async function GET(request: NextRequest) {
  try {
    // Parse and validate query params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = querySchema.parse(searchParams);
    
    // Get session (if needed)
    const session = await getServerSession(authOptions);
    
    // Business logic
    const articles = await getArticles(query, session?.user?.id);
    
    // Return response
    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    // Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid parameters' },
        { status: 400 }
      );
    }
    
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Service Layer

```typescript
// src/modules/news/services/newsService.ts
import { db } from '@/lib/db/initDb';
import { Article } from '@/entities/Article';

interface GetArticlesParams {
  page: number;
  limit: number;
  categoryId?: string;
  sourceId?: string;
  search?: string;
}

export const newsService = {
  async getArticles(params: GetArticlesParams) {
    const { page, limit, categoryId, sourceId, search } = params;
    const offset = (page - 1) * limit;
    
    const qb = db.em.createQueryBuilder(Article, 'a')
      .select('*')
      .leftJoinAndSelect('a.source', 's')
      .leftJoinAndSelect('a.author', 'au')
      .orderBy({ publishedAt: 'DESC' })
      .limit(limit)
      .offset(offset);
    
    if (categoryId) {
      qb.andWhere({ categories: { id: categoryId } });
    }
    
    if (sourceId) {
      qb.andWhere({ source: { id: sourceId } });
    }
    
    if (search) {
      qb.andWhere({
        $or: [
          { title: { $ilike: `%${search}%` } },
          { description: { $ilike: `%${search}%` } },
        ],
      });
    }
    
    const [items, total] = await qb.getResultAndCount();
    
    return {
      items,
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + items.length < total,
      },
    };
  },
  
  async getArticleById(id: string) {
    return db.em.findOne(Article, { id }, {
      populate: ['source', 'author', 'categories'],
    });
  },
};
```

### Custom Hooks

```typescript
// src/modules/news/hooks/useArticles.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { newsQueries } from '../queries/newsQueries';

interface UseArticlesParams {
  categoryId?: string;
  sourceId?: string;
  search?: string;
}

export function useArticles(params: UseArticlesParams = {}) {
  return useInfiniteQuery({
    queryKey: ['articles', params],
    queryFn: ({ pageParam = 1 }) =>
      newsQueries.getArticles({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Reusable Hooks

**useFilters** (for news filtering):

```typescript
// src/modules/news/hooks/useFilters.ts
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const filters = {
    category: searchParams.get('category') || undefined,
    source: searchParams.get('source') || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
  };
  
  const setFilter = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);
  
  const clearFilters = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);
  
  return { filters, setFilter, clearFilters };
}
```

**useSearch** (with debouncing):

```typescript
// src/modules/news/hooks/useSearch.ts
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedValue } from '@/lib/utils/hooks';

export function useSearch(delay = 300) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebouncedValue(search, delay);
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    
    router.push(`?${params.toString()}`);
  }, [debouncedSearch, searchParams, router]);
  
  return { search, setSearch };
}

// Utility hook for debouncing
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

---

## Database Development

### Creating Entities

```typescript
// src/entities/Article.ts
import { Entity, PrimaryKey, Property, ManyToOne, ManyToMany, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Source } from './Source';
import { Author } from './Author';
import { Category } from './Category';

@Entity()
export class Article {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property()
  title!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property({ unique: true })
  url!: string;

  @Property({ nullable: true })
  imageUrl?: string;

  @Property()
  publishedAt!: Date;

  @ManyToOne(() => Source)
  source!: Source;

  @ManyToOne(() => Author, { nullable: true })
  author?: Author;

  @Property()
  externalId!: string;

  @Property({ default: 0 })
  viewCount: number = 0;

  @Property()
  lastSyncedAt!: Date;

  @ManyToMany(() => Category, 'articles', { owner: true })
  categories = new Collection<Category>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
```

### Creating Migrations

```bash
# Create migration
npm run migration:create

# Run migrations
npm run migration:up

# Rollback migration
npm run migration:down
```

### Seeding Data

```typescript
// scripts/seed.ts
import { db } from '../src/lib/db/initDb';
import { Source } from '../src/entities/Source';

async function seed() {
  const sources = [
    { name: 'The Guardian', slug: 'guardian', apiIdentifier: 'guardian' },
    { name: 'NewsAPI.org', slug: 'newsapi', apiIdentifier: 'newsapi' },
    { name: 'The New York Times', slug: 'nytimes', apiIdentifier: 'nytimes' },
    { name: 'BBC News', slug: 'bbc', apiIdentifier: 'bbc' },
  ];

  for (const sourceData of sources) {
    const source = db.em.create(Source, sourceData);
    await db.em.persistAndFlush(source);
  }

  console.log('Seeding completed');
}

seed().catch(console.error);
```

---

## Testing

### Unit Tests

```typescript
// src/modules/news/services/newsService.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { newsService } from './newsService';

describe('newsService', () => {
  beforeEach(async () => {
    // Setup test database
  });

  it('should fetch articles with pagination', async () => {
    const result = await newsService.getArticles({
      page: 1,
      limit: 20,
    });

    expect(result.items).toBeInstanceOf(Array);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(20);
  });

  it('should filter articles by category', async () => {
    const result = await newsService.getArticles({
      page: 1,
      limit: 20,
      categoryId: 'test-category-id',
    });

    expect(result.items.every(a => 
      a.categories.some(c => c.id === 'test-category-id')
    )).toBe(true);
  });
});
```

### Integration Tests

```typescript
// tests/integration/api/news.spec.ts
import { describe, it, expect } from 'vitest';

describe('GET /api/news', () => {
  it('should return articles', async () => {
    const response = await fetch('http://localhost:3000/api/news');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.items).toBeInstanceOf(Array);
  });

  it('should require authentication for favorites', async () => {
    const response = await fetch('http://localhost:3000/api/user/favorites');
    expect(response.status).toBe(401);
  });
});
```

---

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**

```
feat(auth): add email verification

Implement email verification flow with token generation
and expiration handling.

Closes #123
```

```
fix(news): resolve infinite scroll issue

Fixed duplicate articles appearing when scrolling quickly.
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push branch and create PR
4. Request review
5. Address feedback
6. Merge after approval

---

## Debugging

### VS Code Launch Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Logging

```typescript
// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Production logging (structured)
import { logger } from '@/lib/utils/logger';

logger.info('User logged in', { userId, email });
logger.error('Failed to fetch articles', { error, source });
```

---

## Performance Tips

1. **Use React.memo for expensive components**
2. **Implement code splitting with dynamic imports**
3. **Optimize images with Next.js Image component**
4. **Use TanStack Query for caching**
5. **Implement virtualization for long lists**
6. **Debounce search inputs**
7. **Use database indexes for frequent queries**

---

## Common Issues

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL status
pg_isready

# Restart PostgreSQL
brew services restart postgresql
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MikroORM Documentation](https://mikro-orm.io/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

## Conclusion

Following these conventions and practices ensures consistent, maintainable, and high-quality code across the project.
