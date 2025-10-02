# Articles List/Search Page - Feature Specification

**Date:** October 1, 2025  
**Page:** `/articles` or `/search`  
**Status:** Ready for Implementation

---

## 🎯 Feature Overview

A comprehensive articles list page with advanced search and filtering capabilities, supporting mobile-first design, infinite scroll, and excellent UX.

---

## 📋 Requirements

### **1. Entry Points**
- **"See All" links** on home page sections
- **Category cards** redirect to `/articles?category={slug}`
- **Direct navigation** to `/articles`

### **2. Layout**

```
┌─────────────────────────────────────────┐
│  Header: Logo | Search | User           │
├─────────────────────────────────────────┤
│                                         │
│  [Search Input]          [Filter 🔽]   │
│                                         │
│  [Clear Search] [Clear Filters]        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Article Card 1                 │   │
│  ├─────────────────────────────────┤   │
│  │  Article Card 2                 │   │
│  ├─────────────────────────────────┤   │
│  │  Article Card 3                 │   │
│  ├─────────────────────────────────┤   │
│  │  Loading Skeleton...            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Go to Top ↑]                         │
│                                         │
└─────────────────────────────────────────┘
```

### **3. Search & Filter Bar**

**Desktop:**
```
┌──────────────────────────────────────────────┐
│  🔍 [Search articles...]    [Filters 🔽]    │
└──────────────────────────────────────────────┘
```

**Mobile:**
```
┌──────────────────────────┐
│  🔍 [Search articles...] │
├──────────────────────────┤
│  [Filters 🔽]           │
└──────────────────────────┘
```

### **4. Filter Panel (Dropdown)**

When filter button clicked, show dropdown panel:

```
┌─────────────────────────────────┐
│  Filters                    [×] │
├─────────────────────────────────┤
│                                 │
│  Categories (Multi-select)      │
│  [Select categories... 🔽]      │
│                                 │
│  Sources (Multi-select)         │
│  [Select sources... 🔽]         │
│                                 │
│  Authors (Multi-select)         │
│  [Select authors... 🔽]         │
│                                 │
│  Date Range                     │
│  From: [📅 Select date]         │
│  To:   [📅 Select date]         │
│                                 │
│  [Clear All]    [Apply]         │
└─────────────────────────────────┘
```

**Features:**
- Themed `react-select` for multi-select dropdowns
- Themed `react-datepicker` for date range
- Alphabetical order for categories and sources
- Auto-apply on dropdown close
- Close button (×) to dismiss

---

## 🔍 Search Functionality

### **Search Input:**
- Placeholder: "Search articles..."
- Debounce: 500ms
- Searches: title, description
- Clear button (× icon) when text entered
- Loading indicator during search

### **Search Behavior:**
```typescript
// Debounced search
const debouncedSearch = debounce((query: string) => {
  fetchArticles({ search: query, ...filters });
}, 500);
```

---

## 🎛️ Filter Functionality

### **Filter Criteria:**

1. **Categories** (Multi-select)
   - All categories from database
   - Alphabetical order
   - OR logic (article matches ANY selected category)

2. **Sources** (Multi-select)
   - All sources from database
   - Alphabetical order
   - OR logic (article from ANY selected source)

3. **Authors** (Multi-select)
   - All authors from database
   - Alphabetical order
   - OR logic (article by ANY selected author)

4. **Date Range** (From/To)
   - From date (optional)
   - To date (optional)
   - AND logic (article within date range)

### **Multi-Criteria Logic:**
```typescript
// OR within same filter type
categories: [cat1, cat2] // article in cat1 OR cat2

// AND between different filter types
{
  categories: [cat1, cat2],  // article in cat1 OR cat2
  sources: [src1],           // AND article from src1
  dateFrom: '2024-01-01'     // AND article after date
}
```

### **Filter Application:**
- Auto-apply when dropdown/datepicker closes
- Update URL params
- Fetch new results
- Show loading state

---

## 🔗 URL State Management

### **URL Parameters:**
```
/articles?search=tech&category=business,tech&source=guardian&author=john-doe&from=2024-01-01&to=2024-12-31
```

**Supported Params:**
- `search` - Search query string
- `category` - Comma-separated category slugs
- `source` - Comma-separated source slugs
- `author` - Comma-separated author IDs
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)
- `page` - Page number (for pagination fallback)

### **Default State from URL:**
- Parse URL params on page load
- Pre-populate search input
- Pre-select filters
- Fetch articles with params

---

## ♾️ Infinite Scroll

### **Implementation:**
- Use `react-intersection-observer`
- Load 20 articles per page
- Show loading skeleton at bottom
- Auto-load when user scrolls to bottom
- Stop loading when no more articles

### **Loading States:**
```typescript
// Initial load
<LoadingSkeleton count={20} />

// Loading more
<>
  {articles.map(article => <ArticleCard />)}
  <LoadingSkeleton count={5} />
</>

// No more articles
<div>No more articles</div>
```

### **Skeleton:**
- Use `react-loading-skeleton`
- Match ArticleCard layout
- Show 20 skeletons on initial load
- Show 5 skeletons when loading more

---

## 🖼️ Image Optimization

### **Lazy Loading:**
- Use Next.js `<Image>` component
- `loading="lazy"` attribute
- Blur placeholder
- Responsive sizes

### **Performance:**
```typescript
<Image
  src={article.imageUrl}
  alt={article.title}
  fill
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..."
  sizes="(max-width: 768px) 128px, 160px"
/>
```

---

## 📱 Mobile-First Design

### **Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### **Mobile Optimizations:**
- Stack search and filter vertically
- Full-width filter panel
- Touch-friendly buttons (min 44px)
- Swipe gestures for filter panel
- Sticky search bar
- Larger tap targets

### **Responsive Layout:**
```css
/* Mobile */
.search-bar {
  flex-direction: column;
  gap: 12px;
}

/* Desktop */
@media (min-width: 768px) {
  .search-bar {
    flex-direction: row;
    justify-content: space-between;
  }
}
```

---

## 🎨 UX Enhancements

### **1. Clear Actions**
- **Clear Search:** × button in search input
- **Clear Filters:** "Clear All" button in filter panel
- **Clear Individual Filter:** × on each selected item

### **2. Visual Feedback**
- Loading spinner during fetch
- Skeleton placeholders
- Filter count badge (e.g., "Filters (3)")
- Active filter chips below search bar

### **3. Empty States**

**No Results:**
```
┌─────────────────────────────┐
│                             │
│     🔍                      │
│                             │
│  No articles found          │
│                             │
│  Try adjusting your         │
│  search or filters          │
│                             │
│  [Clear All Filters]        │
│                             │
└─────────────────────────────┘
```

**No Articles in Database:**
```
┌─────────────────────────────┐
│                             │
│     📰                      │
│                             │
│  No articles available      │
│                             │
│  Check back later!          │
│                             │
└─────────────────────────────┘
```

### **4. Go to Top Button**
- Fixed position (bottom-right)
- Show after scrolling 300px
- Smooth scroll to top
- Hide when at top

---

## 🚀 Performance Optimizations

### **1. Virtual Scrolling**
- Use `react-virtual` for large lists (>100 items)
- Only render visible items
- Maintain scroll position

### **2. Debouncing**
- Search input: 500ms debounce
- Filter changes: Apply on close (no debounce needed)

### **3. Caching**
- Cache API responses (React Query)
- Stale-while-revalidate strategy
- Cache duration: 5 minutes

### **4. Code Splitting**
- Lazy load filter panel
- Lazy load date picker
- Lazy load react-select

---

## 🔌 API Endpoint

### **`GET /api/articles`**

**Query Parameters:**
```typescript
{
  search?: string;           // Search query
  categories?: string[];     // Category IDs
  sources?: string[];        // Source IDs
  authors?: string[];        // Author IDs
  dateFrom?: string;         // ISO date
  dateTo?: string;           // ISO date
  page?: number;             // Page number (default: 1)
  limit?: number;            // Items per page (default: 20)
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    articles: Article[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      hasMore: boolean
    }
  }
}
```

---

## 🧩 Component Structure

```
/articles
  └── page.tsx (Server Component)
      └── ArticlesListClient.tsx (Client Component)
          ├── SearchBar.tsx
          │   ├── SearchInput.tsx
          │   └── FilterButton.tsx
          ├── FilterPanel.tsx
          │   ├── CategorySelect.tsx (react-select)
          │   ├── SourceSelect.tsx (react-select)
          │   ├── AuthorSelect.tsx (react-select)
          │   └── DateRangePicker.tsx (react-datepicker)
          ├── ActiveFilters.tsx (chips)
          ├── ArticlesList.tsx
          │   ├── ArticleCard.tsx
          │   └── ArticleCardSkeleton.tsx
          ├── EmptyState.tsx
          └── GoToTopButton.tsx
```

---

## 📦 Dependencies

```json
{
  "react-select": "^5.8.1",           // ✅ Already installed
  "react-datepicker": "^7.4.0",       // ✅ Already installed
  "react-loading-skeleton": "^3.4.0", // ❌ Need to install
  "react-intersection-observer": "^9.13.1", // ✅ Already installed
  "@tanstack/react-virtual": "^3.10.8" // ✅ Already installed
}
```

---

## ✅ Acceptance Criteria

- [ ] Search input with 500ms debounce
- [ ] Filter panel with 4 filters (categories, sources, authors, date range)
- [ ] Multi-select dropdowns (themed react-select)
- [ ] Date range picker (themed react-datepicker)
- [ ] Auto-apply filters on dropdown close
- [ ] Multi-criteria OR logic within same type
- [ ] Clear search button
- [ ] Clear filters button
- [ ] URL state management (all params)
- [ ] Default state from URL params
- [ ] Infinite scroll with intersection observer
- [ ] Loading skeletons (react-loading-skeleton)
- [ ] Lazy load images (Next.js Image)
- [ ] Virtual scrolling for large lists
- [ ] Go to top button
- [ ] Mobile-first responsive design
- [ ] Empty state handling
- [ ] Active filter chips display
- [ ] Filter count badge
- [ ] Excellent UX (smooth transitions, feedback)

---

## 🎯 Implementation Order

1. **Install dependencies** (react-loading-skeleton)
2. **Create API endpoint** (`/api/articles`)
3. **Build SearchBar component** (input + filter button)
4. **Build FilterPanel component** (4 filters)
5. **Build ArticlesList component** (infinite scroll)
6. **Build ArticleCardSkeleton** (loading state)
7. **Add URL state management** (useSearchParams)
8. **Add empty states**
9. **Add Go to Top button**
10. **Mobile optimization**
11. **Performance optimization** (virtual scroll)
12. **Testing & polish**

---

**Status:** Ready for implementation  
**Estimated Time:** 6-8 hours  
**Priority:** High (Core Requirement #1)
