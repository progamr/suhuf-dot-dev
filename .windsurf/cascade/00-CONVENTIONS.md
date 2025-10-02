# Project Conventions

## Component Folder Structure

### Shared Components (Reusable Across Features)
Components that are reusable across multiple features should be placed in a `/shared` folder:

```
/FeatureModule/components/shared/
  ├── /ComponentName
  │   ├── ComponentName.tsx
  │   └── ComponentName.spec.tsx
```

**Example:**
```
/feed/components/shared/
  ├── /LatestNews
  │   ├── LatestNews.tsx
  │   └── LatestNews.spec.tsx
  ├── /LatestArticles
  │   ├── LatestArticles.tsx
  │   └── LatestArticles.spec.tsx
  └── /CategoriesGrid
      ├── CategoriesGrid.tsx
      └── CategoriesGrid.spec.tsx
```

### Non-Reusable Components (Feature-Specific)
Components that are specific to a feature should be organized in folders with the following structure:

```
/ComponentName
  ├── ComponentName.tsx
  ├── ComponentName.spec.tsx
  ├── /ChildComponent1
  │   ├── ChildComponent1.tsx
  │   └── ChildComponent1.spec.tsx
  └── /ChildComponent2
      ├── ChildComponent2.tsx
      └── ChildComponent2.spec.tsx
```

**Example:**
```
/PersonalizedFeed
  ├── PersonalizedFeed.tsx
  ├── PersonalizedFeed.spec.tsx
  ├── index.ts
  ├── /LatestNews
  │   ├── LatestNews.tsx
  │   └── LatestNews.spec.tsx
  ├── /TopCategories
  │   ├── TopCategories.tsx
  │   └── TopCategories.spec.tsx
  └── /NoAggregatedContent
      ├── NoAggregatedContent.tsx
      └── NoAggregatedContent.spec.tsx
```

### Reusable Components (UI Components)
Reusable components should be placed in `/components/ui/` with the same folder structure:

```
/components/ui/ComponentName
  ├── ComponentName.tsx
  ├── ComponentName.spec.tsx
  └── index.ts
```

**Example:**
```
/components/ui/ErrorMessage
  ├── ErrorMessage.tsx
  ├── ErrorMessage.spec.tsx
  └── index.ts
```

## API Request Naming Convention

### Request Functions
API request functions should follow this naming pattern:
**`[HTTPVerb][Description]Request.ts`**

**Examples:**
- `getPersonalizedFeedRequest.ts`
- `getPublicFeedRequest.ts`
- `getArticleByIdRequest.ts`
- `createUserRequest.ts`
- `updateArticleRequest.ts`
- `deleteCommentRequest.ts`

### Location
All request functions should be placed in:
```
/infrastructure/requests/
```

### Structure
```typescript
import { ENDPOINTS } from '@/infrastructure/constants/api';
import { ReturnType } from '@/types/domain';

export async function getResourceRequest(params?: any): Promise<ReturnType> {
  const response = await fetch(ENDPOINTS.RESOURCE);
  
  if (!response.ok) {
    throw new Error('Failed to fetch resource');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch resource');
  }
  
  return data.data;
}
```

## React Query Hooks Naming Convention

### Query/Mutation Hooks
React Query hooks should follow this naming pattern:
**`use[HTTPVerb][Description]Query.ts`** for queries
**`use[HTTPVerb][Description]Mutation.ts`** for mutations

**Examples:**
- `useGetPersonalizedFeedQuery.ts`
- `useGetPublicFeedQuery.ts`
- `useGetArticleByIdQuery.ts`
- `useCreateUserMutation.ts`
- `useUpdateArticleMutation.ts`
- `useDeleteCommentMutation.ts`

### Location
- Queries: `/infrastructure/state/queries/`
- Mutations: `/infrastructure/state/mutations/`

### Structure for Queries
```typescript
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getResourceRequest } from '@/infrastructure/requests/getResourceRequest';
import { ReturnType } from '@/types/domain';

export function useGetResourceQuery(params?: any): UseQueryResult<ReturnType, Error> {
  return useQuery({
    queryKey: ['resource', params],
    queryFn: () => getResourceRequest(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### Structure for Mutations
```typescript
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { createResourceRequest } from '@/infrastructure/requests/createResourceRequest';
import { InputType, ReturnType } from '@/types/domain';

export function useCreateResourceMutation(): UseMutationResult<ReturnType, Error, InputType> {
  return useMutation({
    mutationFn: createResourceRequest,
  });
}
```

## API Constants

### Location
```
/infrastructure/constants/api.ts
```

### Structure
```typescript
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const ENDPOINTS = {
  // Group by domain
  RESOURCE: '/api/resource',
  RESOURCE_BY_ID: (id: string) => `/api/resource/${id}`,
} as const;
```

## Type Organization

### Location
Types should be organized by domain in:
```
/types/[domain]/
```

**Example:**
```
/types/feed/
  ├── Article.ts
  ├── Category.ts
  ├── FeedData.ts
  └── index.ts
```

### Structure
Each type should be in its own file and exported through an index.ts:

```typescript
// Article.ts
export interface Article {
  id: string;
  title: string;
  // ... other fields
}

// index.ts
export type { Article } from './Article';
export type { Category } from './Category';
export type { FeedData } from './FeedData';
```

## Component Design Principles

1. **Single Responsibility**: Each component should have one clear purpose
2. **Self-Contained**: Components should manage their own visibility and logic
3. **Type Safety**: Use TypeScript interfaces for all props
4. **Reusability**: Extract common patterns into reusable components
5. **Testing**: Every component should have a corresponding .spec.tsx file
6. **Barrel Exports**: Use index.ts files for cleaner imports

## Best Practices

1. Always use the centralized ENDPOINTS constant for API calls
2. Never hardcode API URLs in components or request functions
3. Use React Query hooks for all data fetching
4. Keep request functions pure and focused on HTTP communication
5. Handle errors consistently using the ErrorMessage component
6. Use loading skeletons that match the actual content layout
7. Export types through barrel files (index.ts) for cleaner imports
