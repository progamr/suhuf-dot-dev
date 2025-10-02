# OnboardingForm Refactoring Summary

## Overview
Applied comprehensive refactoring to OnboardingForm following the same patterns as PersonalizedFeed and PublicFeed, with added React Hook Form (RHF) and Zod validation.

## Key Changes

### 1. **Type Organization**
Created domain-specific types in `/types/onboarding/`:
- `Source.ts` - News source type
- `Author.ts` - Author type
- `OnboardingPreferences.ts` - Preferences payload type
- `index.ts` - Barrel export

### 2. **API Layer**

#### Constants (`/infrastructure/constants/api.ts`)
Added onboarding endpoints:
```typescript
SOURCES: '/api/sources',
CATEGORIES: '/api/categories',
AUTHORS: '/api/authors',
USER_PREFERENCES: '/api/user/preferences',
```

#### Request Functions (`/modules/onboarding/requests/`)
- `getSourcesRequest.ts`
- `getCategoriesRequest.ts`
- `getAuthorsRequest.ts`
- `savePreferencesRequest.ts`

All follow naming convention: `[HTTPVerb][Description]Request.ts`

### 3. **State Management**

#### Queries (`/modules/onboarding/state/queries/`)
- `getSourcesQuery.ts` - useGetSourcesQuery
- `getCategoriesQuery.ts` - useGetCategoriesQuery
- `getAuthorsQuery.ts` - useGetAuthorsQuery

#### Mutations (`/modules/onboarding/state/mutations/`)
- `savePreferencesMutation.ts` - useSavePreferencesMutation

All follow naming convention: `use[HTTPVerb][Description]Query/Mutation.ts`

### 4. **Validation** (`/modules/onboarding/validation/`)

#### Zod Schema (`onboardingSchema.ts`)
```typescript
export const onboardingSchema = z.object({
  sourceIds: z.array(z.string()).min(2, 'Please select at least 2 sources'),
  categoryIds: z.array(z.string()).min(2, 'Please select at least 2 categories'),
  authorIds: z.array(z.string()).default([]),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
```

**Benefits**:
- Type-safe form data
- Centralized validation rules
- Automatic error messages
- Easy to modify validation logic

### 5. **Component Structure**

#### Before (Monolithic)
```
OnboardingForm.tsx (429 lines)
- All logic in one file
- Inline state management
- Manual validation
- Inline API calls
```

#### After (Modular)
```
/OnboardingForm/
├── OnboardingForm.tsx (220 lines)
├── OnboardingForm.spec.tsx
├── index.ts
├── /StepIndicator/
│   ├── StepIndicator.tsx
│   └── StepIndicator.spec.tsx
├── /SourcesStep/
│   ├── SourcesStep.tsx
│   └── SourcesStep.spec.tsx
├── /CategoriesStep/
│   ├── CategoriesStep.tsx
│   └── CategoriesStep.spec.tsx
└── /AuthorsStep/
    ├── AuthorsStep.tsx
    └── AuthorsStep.spec.tsx
```

### 6. **React Hook Form Integration**

#### Form Setup
```typescript
const {
  watch,
  setValue,
  handleSubmit,
  formState: { errors },
} = useForm<OnboardingFormData>({
  resolver: zodResolver(onboardingSchema),
  defaultValues: {
    sourceIds: [],
    categoryIds: [],
    authorIds: [],
  },
  mode: 'onChange',
});
```

**Benefits**:
- Automatic validation on change
- Type-safe form data
- Built-in error handling
- Optimized re-renders

#### Form Submission
```typescript
const onSubmit = async (data: OnboardingFormData) => {
  try {
    await savePreferencesMutation.mutateAsync(data);
    router.push('/');
    router.refresh();
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};
```

## Component Breakdown

### **OnboardingForm** (Main Container)
**Responsibilities**:
- Form state management (RHF)
- Step navigation
- Data fetching (React Query)
- Form submission (React Query Mutation)
- Orchestration of child components

**Code Reduction**: 429 lines → 220 lines

### **StepIndicator**
**Responsibilities**:
- Display progress through steps
- Visual feedback for completed steps
- Current step highlighting

**Props**:
```typescript
{
  currentStep: 'sources' | 'categories' | 'authors';
  sourcesComplete: boolean;
  categoriesComplete: boolean;
}
```

### **SourcesStep**
**Responsibilities**:
- Display available sources
- Handle source selection
- Show selection count

**Props**:
```typescript
{
  sources: Source[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}
```

### **CategoriesStep**
**Responsibilities**:
- Display available categories
- Handle category selection
- Show selection count

**Props**:
```typescript
{
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}
```

### **AuthorsStep**
**Responsibilities**:
- Display available authors
- Handle author selection (optional)
- Show selection count

**Props**:
```typescript
{
  authors: Author[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}
```

## Architecture Benefits

### 1. **Separation of Concerns**
- **Form Logic**: React Hook Form
- **Validation**: Zod schemas
- **Data Fetching**: React Query
- **UI Components**: Presentational components
- **API Communication**: Request functions

### 2. **Type Safety**
- Zod schema generates TypeScript types
- Type-safe form data throughout
- Compile-time error detection
- Better IDE autocomplete

### 3. **Validation**
- Centralized validation rules
- Automatic error messages
- Real-time validation
- Easy to modify rules

### 4. **Testability**
- Small, focused components
- Easy to mock queries/mutations
- Validation logic separate from UI
- Request functions are pure

### 5. **Maintainability**
- Clear folder structure
- Single responsibility per component
- Easy to locate code
- Consistent patterns

### 6. **Performance**
- React Query caching
- Optimized re-renders (RHF)
- Parallel data fetching
- Efficient form updates

## Code Comparison

### Before (Manual State)
```typescript
const [sources, setSources] = useState<Source[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/sources');
    const data = await response.json();
    if (data.success) setSources(data.data);
  } catch (err) {
    setError('Failed to load');
  } finally {
    setLoading(false);
  }
};
```

### After (React Query)
```typescript
const { data: sources = [], isLoading } = useGetSourcesQuery();
```

### Before (Manual Validation)
```typescript
const handleNext = () => {
  if (step === 'sources') {
    if (selectedSources.size < 2) {
      setError('Please select at least 2 sources');
      return;
    }
    setError(null);
    setStep('categories');
  }
};
```

### After (Zod + RHF)
```typescript
// Validation happens automatically
const handleNext = () => {
  if (step === 'sources') {
    if (sourceIds.length < 2) return; // Zod already validated
    setStep('categories');
  }
};
```

## File Structure

```
/modules/onboarding/
├── /components/
│   └── /OnboardingForm/
│       ├── OnboardingForm.tsx
│       ├── OnboardingForm.spec.tsx
│       ├── index.ts
│       ├── /StepIndicator/
│       ├── /SourcesStep/
│       ├── /CategoriesStep/
│       └── /AuthorsStep/
├── /requests/
│   ├── getSourcesRequest.ts
│   ├── getCategoriesRequest.ts
│   ├── getAuthorsRequest.ts
│   └── savePreferencesRequest.ts
├── /state/
│   ├── /queries/
│   │   ├── getSourcesQuery.ts
│   │   ├── getCategoriesQuery.ts
│   │   └── getAuthorsQuery.ts
│   └── /mutations/
│       └── savePreferencesMutation.ts
└── /validation/
    └── onboardingSchema.ts

/types/onboarding/
├── Source.ts
├── Author.ts
├── OnboardingPreferences.ts
└── index.ts
```

## Migration Notes

### Old File to Delete
- `/modules/onboarding/components/OnboardingForm.tsx` (old monolithic file)

### Import Changes
```typescript
// Old
import { OnboardingForm } from '@/modules/onboarding/components/OnboardingForm';

// New (same, thanks to barrel export)
import { OnboardingForm } from '@/modules/onboarding/components/OnboardingForm';
```

## Benefits Summary

✅ **React Hook Form**: Type-safe, performant form management
✅ **Zod Validation**: Centralized, type-safe validation
✅ **React Query**: Automatic caching, loading states, error handling
✅ **Component Splitting**: 4 focused child components
✅ **Type Safety**: End-to-end type safety
✅ **Code Reduction**: 429 lines → 220 lines (main component)
✅ **Maintainability**: Clear separation of concerns
✅ **Testability**: Small, focused, testable units
✅ **Consistent Patterns**: Follows project conventions
✅ **Better UX**: Real-time validation, optimized performance

## Conventions Followed

1. ✅ **Types**: Domain-based organization (`/types/onboarding/`)
2. ✅ **Requests**: `[HTTPVerb][Description]Request.ts`
3. ✅ **Queries**: `use[HTTPVerb][Description]Query.ts`
4. ✅ **Mutations**: `use[HTTPVerb][Description]Mutation.ts`
5. ✅ **Validation**: Separate `/validation` folder
6. ✅ **Components**: Folder structure with spec files
7. ✅ **API Constants**: Centralized in `/infrastructure/constants/api.ts`

## Onboarding Flow Architecture (Final)

### **Client-Side Check Approach**

After testing multiple approaches, we settled on **client-side onboarding check** for the best balance of clean architecture and reliability.

#### **Flow:**

```
User visits /
     ↓
Server: Check auth (page.tsx)
     ↓
Not logged in? → Show PublicFeed
     ↓
Logged in? → Render <FeedRouter /> (client component)
     ↓
FeedRouter: Call /api/user/onboarding-status
     ↓
API: Check database for preferences
     ↓
No preferences? → router.replace('/onboarding')
     ↓
Has preferences? → Show <PersonalizedFeed />
```

#### **Why This Approach:**

✅ **Clean Architecture**: No DB access outside /api
✅ **Reliable**: Direct API call, no middleware complexity
✅ **Proper Loading States**: Shows loading spinner while checking
✅ **No Infinite Loops**: Uses `useRef` to track redirect
✅ **No History Pollution**: Uses `router.replace()` instead of `push()`
✅ **Reusable API**: `/api/user/onboarding-status` can be called anywhere

#### **Middleware Simplified:**

Middleware now only handles:
- Redirect logged-in users away from auth pages (/login, /signup)
- Redirect logged-out users away from /onboarding
- **No onboarding status check** (moved to client)

### **Key Files:**

1. **`/app/page.tsx`** - Server component, auth check only
2. **`/modules/feed/components/FeedRouter/`** - Client component, onboarding check
3. **`/api/user/onboarding-status/route.ts`** - API endpoint with DB access
4. **`/middleware.ts`** - Simplified, basic auth redirects only

## Next Steps

1. Add comprehensive tests for all components
2. Add tests for validation schemas
3. Add tests for request functions
4. Add error boundaries
5. Consider adding form persistence (localStorage)
6. Add analytics tracking for step completion
7. Monitor for any edge cases in production

## Lessons Learned

1. **RHF + Zod**: Powerful combination for forms
2. **React Query**: Simplifies data fetching dramatically
3. **Component Splitting**: Makes code more maintainable
4. **Validation Folder**: Good place for Zod schemas
5. **Consistent Patterns**: Makes codebase predictable
6. **Client-Side Checks**: Sometimes simpler than server-side for routing logic
7. **Middleware Limitations**: Keep middleware simple, avoid complex API calls
