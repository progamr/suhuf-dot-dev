# Suhuf - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** October 1, 2025  
**Project:** News/Blog Aggregator Application  

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Data Model](#data-model)
4. [User Flows](#user-flows)
5. [Page Specifications](#page-specifications)
6. [API Endpoints](#api-endpoints)
7. [Implementation Progress](#implementation-progress)
8. [Future Enhancements](#future-enhancements)

---

## 1. Project Overview

### 1.1 Product Vision
Suhuf is a personalized news aggregator that pulls articles from multiple trusted sources (The Guardian, NewsAPI, NY Times) and provides users with a customized reading experience based on their preferences.

### 1.2 Core Features
- ✅ Multi-source news aggregation (Guardian, NewsAPI, NY Times)
- 🔄 Personalized news feed based on user preferences (Authenticated)
- 🔄 Guest user experience (View-only, no personalization)
- 🔍 Advanced search and filtering
- ⭐ Favorite articles (Authenticated)
- 📱 Mobile-responsive design
- 🌓 Dark/Light theme support
- 👤 User authentication and preferences

### 1.3 Target Users
- **Authenticated Users:** News enthusiasts who want curated content and personalized feeds
- **Guest Users:** Casual readers who want to browse latest news without signing up
- **Power Users:** Readers who want to follow specific topics, authors, or sources

---

## 2. Technical Architecture

### 2.1 Tech Stack
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** MikroORM
- **Authentication:** NextAuth.js
- **News Sources:** Guardian API, NewsAPI.org, NY Times API

### 2.2 Database Schema

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Source    │────────>│   Article    │<────────│   Category  │
└─────────────┘         └──────────────┘         └─────────────┘
                               │                          
                               │                          
                        ┌──────┴──────┐                  
                        │             │                  
                        v             v                  
                  ┌──────────┐  ┌──────────┐            
                  │  Author  │  │   User   │            
                  └──────────┘  └──────────┘            
                                      │                  
                                      │                  
                        ┌─────────────┼─────────────┐    
                        │             │             │    
                        v             v             v    
                  ┌──────────┐  ┌──────────┐  ┌──────────┐
                  │ Favorite │  │UserPref  │  │ArticleView│
                  └──────────┘  └──────────┘  └──────────┘
```

### 2.3 Data Sync Flow

```
Data Source 1 (Guardian) ──┐
                           │
Data Source 2 (NewsAPI) ───┼──> Sync Service ──> Database ──> API ──> Frontend
                           │
Data Source 3 (NY Times) ──┘
```

**Sync Process:**
1. Scheduled cron job (every 30-60 minutes)
2. Fetch articles from all sources
3. Transform to unified format
4. Check for duplicates
5. Save to database
6. Log sync results

---

## 3. Data Model

### 3.1 Core Entities

#### User
```typescript
{
  id: UUID
  email: string (unique)
  name: string
  password: string (hashed)
  emailVerified: Date | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}
```

#### Article
```typescript
{
  id: UUID
  title: string
  description: string
  url: string (unique)
  imageUrl: string | null
  publishedAt: Date
  externalId: string
  viewCount: number
  lastSyncedAt: Date
  source: Source (relation)
  author: Author (relation)
  categories: Category[] (many-to-many)
  createdAt: Date
  updatedAt: Date
}
```

#### Source
```typescript
{
  id: UUID
  name: string (e.g., "The Guardian")
  slug: string (e.g., "guardian")
  apiIdentifier: string (e.g., "guardian")
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Category
```typescript
{
  id: UUID
  name: string (e.g., "Politics")
  slug: string (e.g., "politics")
  createdAt: Date
  updatedAt: Date
}
```

#### Author
```typescript
{
  id: UUID
  name: string
  source: Source (relation)
  createdAt: Date
  updatedAt: Date
}
```

#### UserPreference
```typescript
{
  id: UUID
  user: User (relation)
  preferredSources: string[] (source IDs)
  preferredCategories: string[] (category slugs)
  preferredAuthors: string[] (author IDs)
  theme: 'light' | 'dark' | 'system'
  createdAt: Date
  updatedAt: Date
}
```

#### Favorite
```typescript
{
  id: UUID
  user: User (relation)
  article: Article (relation)
  createdAt: Date
}
```

#### ArticleView
```typescript
{
  id: UUID
  user: User (relation)
  article: Article (relation)
  viewedAt: Date
}
```

---

## 4. User Flows

### 4.1 Authentication Flow

```
┌─────────────┐
│   Landing   │
└──────┬──────┘
       │
       ├──> Login ──> Enter Email/Password ──> Home
       │
       └──> Signup ──> Enter Email/Password ──> Confirm Email ──> Onboarding ──> Home
```

**Screens:**
- **Page 7:** Login (Email + Password fields, Login button)
- **Page 7:** Signup (Email + Password fields, Signup button)
- **Confirm Email:** Code input field + Confirm button

### 4.2 Onboarding Flow

```
┌──────────────┐
│ First Login  │
└──────┬───────┘
       │
       v
┌──────────────────────────────┐
│  Page 5: Preferences Setup   │
│  - Select Sources (x2)       │
│  - Select Categories (x2+)   │
│  - Select Authors (optional) │
│  - "Save My Pref" button     │
└──────┬───────────────────────┘
       │
       v
┌──────────────┐
│  Page 1:     │
│  Home Feed   │
└──────────────┘
```

### 4.3 Main Navigation Flow

```
┌─────────────┐
│    Home     │ ──> Personalized Feed
└──────┬──────┘
       │
       ├──> Search ──> Results ──> Article Detail
       │
       ├──> Favorites ──> Article Detail
       │
       └──> Settings ──> Update Preferences
```

---

## 5. Page Specifications

### 5.1 Page 1A: Home Feed (Authenticated User)

**Layout:**
```
┌────────────────────────────────────────────┐
│  Header: Logo | Search | Profile           │
├────────────────────────────────────────────┤
│                                            │
│  Section 1: Latest Personalized News      │
│  ┌──────────────────────────────────────┐ │
│  │  [Hero Carousel - 3-5 articles]      │ │
│  │  • • • • (pagination dots)           │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Section 2: Your Preferred Categories     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │Politics │ │Business │ │Tech     │    │
│  │ [img]   │ │ [img]   │ │ [img]   │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│  ┌─────────┐ ┌─────────┐                │
│  │Science  │ │Sports   │                │
│  └─────────┘ └─────────┘                │
│                                            │
│  Section 3: From Your Sources & Authors   │
│  ┌──────────────────────────────────────┐ │
│  │  Guardian: [Article 1]               │ │
│  │  NY Times: [Article 2]               │ │
│  │  By [Author Name]: [Article 3]       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Bottom Nav: Home | Search | Favorites    │
└────────────────────────────────────────────┘
```

**Components:**
- **Hero Carousel:** Auto-rotating carousel showing latest personalized articles
- **Category Grid:** 2x2 or 2x3 grid of category cards with images
- **Source/Author Feed:** List of articles from user's preferred sources and authors

**Data Requirements:**
- Latest 5 articles matching user preferences (for carousel)
- User's preferred categories (for grid)
- Latest articles from user's preferred sources (for section 3)
- Latest articles from user's preferred authors (for section 3)

**API Endpoints:**
```
GET /api/feed/personalized?limit=5
GET /api/feed/by-category?categories=politics,business,tech
GET /api/feed/by-source?sources=guardian,nytimes
GET /api/feed/by-author?authors=author-id-1,author-id-2
```

---

### 5.1B: Home Feed (Guest User) 🆕

**Layout:**
```
┌────────────────────────────────────────────┐
│  Header: Logo | Search | Login/Signup     │
├────────────────────────────────────────────┤
│                                            │
│  Section 1: Latest News                   │
│  ┌──────────────────────────────────────┐ │
│  │  [Hero Carousel - 3-5 articles]      │ │
│  │  • • • • (pagination dots)           │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Section 2: Popular Categories            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │Politics │ │Business │ │Tech     │    │
│  │ [img]   │ │ [img]   │ │ [img]   │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│  ┌─────────┐ ┌─────────┐                │
│  │Science  │ │Sports   │                │
│  └─────────┘ └─────────┘                │
│                                            │
│  Section 3: From All Sources              │
│  ┌──────────────────────────────────────┐ │
│  │  Guardian: [Article 1]               │ │
│  │  NY Times: [Article 2]               │ │
│  │  NewsAPI: [Article 3]                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Sign up to personalize your feed!   │ │
│  │  [Create Account]                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Bottom Nav: Home | Search | Login        │
└────────────────────────────────────────────┘
```

**Differences from Authenticated:**
- No personalization (shows latest news from all sources)
- No "Favorites" in bottom nav (replaced with "Login")
- CTA banner to encourage signup
- Popular categories instead of user preferences
- All sources shown in section 3 (not filtered by preferences)

**Components:**
- **Hero Carousel:** Latest articles from all sources (sorted by date)
- **Category Grid:** Most popular categories
- **Source Feed:** Latest articles from each source

**Data Requirements:**
- Latest 5 articles from all sources (for carousel)
- Most popular categories (for grid)
- Latest articles from each source (for section 3)

**API Endpoints:**
```
GET /api/feed/latest?limit=5
GET /api/categories/popular
GET /api/feed/by-source?sources=all
```

---

### 5.2 Page 2: Search & Filter

**Layout:**
```
┌────────────────────────────────────────────┐
│  Header: Logo | Search Bar | Profile      │
├────────────────────────────────────────────┤
│                                            │
│  Filters:                                  │
│  ┌─────────────────────────────────────┐  │
│  │ Source: [Guardian ✓] [NY Times ✓]  │  │
│  │ Category: [Politics] [Business]     │  │
│  │ Date: [Last 24h] [Last Week]        │  │
│  └─────────────────────────────────────┘  │
│                                            │
│  Results:                                  │
│  ┌─────────────────────────────────────┐  │
│  │ [Article 1]                         │  │
│  │ Source | Date                       │  │
│  ├─────────────────────────────────────┤  │
│  │ [Article 2]                         │  │
│  │ Source | Date                       │  │
│  └─────────────────────────────────────┘  │
│                                            │
│  Bottom Nav: Home | Search | Favorites    │
└────────────────────────────────────────────┘
```

**Features:**
- Real-time search as user types
- Multi-select filters (source, category, date range)
- Sort options (newest, oldest, most viewed)
- Infinite scroll or pagination

**API Endpoints:**
```
GET /api/articles/search?q=trump&source=guardian&category=politics&from=2025-09-30
```

---

### 5.3 Page 3: Search Results (Alternative View)

**Layout:**
```
┌────────────────────────────────────────────┐
│  Search: [query] ✕                        │
├────────────────────────────────────────────┤
│                                            │
│  Filters: Source | Category | Date        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Article Card]                      │ │
│  │  Title                               │ │
│  │  Description                         │ │
│  │  Source • Date • Category            │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Article Card]                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

---

### 5.4A: Article Detail (Authenticated User)

**Layout:**
```
┌────────────────────────────────────────────┐
│  ← Back                          ⭐ ☰      │
├────────────────────────────────────────────┤
│                                            │
│  Source: [Guardian]                        │
│  Urgent! This is title                     │
│  Day, XX Sep 2025                          │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │         [Hero Image]                 │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Some optional body data here...           │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Read Full Article on Site]         │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  More News:                                │
│  ┌─────────┐ ┌─────────┐                 │
│  │ [img]   │ │ [img]   │                 │
│  │ x2 ago  │ │ x2 ago  │                 │
│  └─────────┘ └─────────┘                 │
│                                            │
│  ┌─────────┐                              │
│  │ [img]   │  "this is good"              │
│  │         │  24/12/2024                  │
│  └─────────┘                              │
│                                            │
└────────────────────────────────────────────┘
```

**Features:**
- Display article metadata (source, title, date, author)
- Hero image
- Article summary/description
- "Read Full Article" button (opens external URL)
- Related articles section (2-3 articles)
- Favorite button (star icon) - functional
- Share button (menu icon)
- Track article view

**API Endpoints:**
```
GET /api/articles/:id
GET /api/articles/:id/related?limit=3
POST /api/favorites
DELETE /api/favorites/:articleId
POST /api/articles/:id/view (track view)
```

---

### 5.4B: Article Detail (Guest User) 🆕

**Layout:**
```
┌────────────────────────────────────────────┐
│  ← Back                               ☰    │
├────────────────────────────────────────────┤
│                                            │
│  Source: [Guardian]                        │
│  Urgent! This is title                     │
│  Day, XX Sep 2025                          │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │         [Hero Image]                 │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Some optional body data here...           │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Read Full Article on Site]         │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Sign up to save favorites!          │ │
│  │  [Create Account]                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  More News:                                │
│  ┌─────────┐ ┌─────────┐                 │
│  │ [img]   │ │ [img]   │                 │
│  │ x2 ago  │ │ x2 ago  │                 │
│  └─────────┘ └─────────┘                 │
│                                            │
│  ┌─────────┐                              │
│  │ [img]   │  "this is good"              │
│  │         │  24/12/2024                  │
│  └─────────┘                              │
│                                            │
└────────────────────────────────────────────┘
```

**Differences from Authenticated:**
- No favorite button (star icon removed)
- CTA banner to encourage signup
- No view tracking
- Share button still available

**Features:**
- Display article metadata (source, title, date, author)
- Hero image
- Article summary/description
- "Read Full Article" button (opens external URL)
- Related articles section (2-3 articles)
- Share button (menu icon)
- CTA to signup

**API Endpoints:**
```
GET /api/articles/:id
GET /api/articles/:id/related?limit=3
```

---

### 5.5 Page 5: Onboarding (Preferences Setup)

**Layout:**
```
┌────────────────────────────────────────────┐
│  Please select your favourite sources      │
│  and categories                            │
├────────────────────────────────────────────┤
│                                            │
│  Sources:                                  │
│  ┌─────────┐ ┌─────────┐                 │
│  │[✓]      │ │[✓]      │                 │
│  │Guardian │ │NY Times │                 │
│  │ x2      │ │ x2      │                 │
│  └─────────┘ └─────────┘                 │
│                                            │
│  Categories:                               │
│  ┌─────────┐ ┌─────────┐                 │
│  │ [✓]     │ │ [✓]     │                 │
│  │Politics │ │Science  │                 │
│  └─────────┘ └─────────┘                 │
│                                            │
│  Authors:                                  │
│  ┌─────────┐ ┌─────────┐                 │
│  │ [ ]     │ │ [✓]     │                 │
│  │ x2 AB   │ │ Some one│                 │
│  └─────────┘ └─────────┘                 │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │      Save my pref                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

**Features:**
- Multi-select sources (minimum 2 required)
- Multi-select categories (minimum 2 required)
- Optional author selection
- "Save my pref" button
- Skip option (use default preferences)

**API Endpoints:**
```
GET /api/sources (list all available sources)
GET /api/categories (list all available categories)
GET /api/authors?source=guardian (list authors by source)
POST /api/user/preferences
```

---

### 5.6 Page 6: Settings/Preferences

**Layout:**
```
┌────────────────────────────────────────────┐
│  Settings                                  │
├────────────────────────────────────────────┤
│                                            │
│  Theme:                                    │
│  ○ Light                                   │
│  ○ Dark                                    │
│  ○ System                                  │
│                                            │
│  Sources:                                  │
│  ┌─────────┐ ┌─────────┐                 │
│  │ [✓]     │ │ [ ]     │                 │
│  │Guardian │ │NewsAPI  │                 │
│  └─────────┘ └─────────┘                 │
│                                            │
│  Categories:                               │
│  ┌─────────┐ ┌─────────┐                 │
│  │ [✓]     │ │ [✓]     │                 │
│  │Politics │ │Business │                 │
│  └─────────┘ └─────────┘                 │
│                                            │
│  Authors:                                  │
│  ┌─────────┐ ┌─────────┐                 │
│  │ [✓]     │ │ [ ]     │                 │
│  │Author 1 │ │Author 2 │                 │
│  └─────────┘ └─────────┘                 │
│                                            │
└────────────────────────────────────────────┘
```

**Features:**
- Theme selection (Light/Dark/System)
- Update source preferences
- Update category preferences
- Update author preferences
- Save changes button

**API Endpoints:**
```
GET /api/user/preferences
PUT /api/user/preferences
```

---

### 5.7 Page 7: Authentication (Login/Signup)

**Login Layout:**
```
┌────────────────────────────────────────────┐
│                                            │
│              Login                         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Email                                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Password                             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │         Login                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Don't have an account? Signup            │
│                                            │
└────────────────────────────────────────────┘
```

**Signup Layout:**
```
┌────────────────────────────────────────────┐
│                                            │
│              Signup                        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Email                                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Password                             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │         Signup                       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Already have an account? Login           │
│                                            │
└────────────────────────────────────────────┘
```

**Confirm Email Layout:**
```
┌────────────────────────────────────────────┐
│                                            │
│          Confirm Email                     │
│                                            │
│  Enter the code sent to your email:       │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Code                                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │         Confirm                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

**API Endpoints:**
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/logout
GET /api/auth/session
```

---

### 5.8 Page 8: Favorites

**Layout:**
```
┌────────────────────────────────────────────┐
│  Favourite Articles                        │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Article Card]                      │ │
│  │  Title                               │ │
│  │  Source • Date                       │ │
│  │  ⭐ Unfavourite                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Article Card]                      │ │
│  │  x2                                  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  [Article Card]                      │ │
│  │  x2                                  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Bottom Nav: Home | Search | Favorites    │
└────────────────────────────────────────────┘
```

**Features:**
- List of user's favorited articles
- Unfavorite button on each card
- Empty state when no favorites
- Pull to refresh

**API Endpoints:**
```
GET /api/favorites
DELETE /api/favorites/:articleId
```

---

## 6. API Endpoints

### 6.1 Authentication
```
POST   /api/auth/signup           - Create new user account
POST   /api/auth/login            - Login user
POST   /api/auth/verify-email     - Verify email with code
POST   /api/auth/logout           - Logout user
GET    /api/auth/session          - Get current session
```

### 6.2 Articles
```
GET    /api/articles              - List articles (with filters)
GET    /api/articles/:id          - Get single article
GET    /api/articles/:id/related  - Get related articles
POST   /api/articles/:id/view     - Track article view
GET    /api/articles/search       - Search articles
```

### 6.3 Feed
```
GET    /api/feed/personalized     - Get personalized feed (Authenticated)
GET    /api/feed/latest           - Get latest articles (Guest)
GET    /api/feed/by-category      - Get articles by category
GET    /api/feed/by-source        - Get articles by source
GET    /api/feed/by-author        - Get articles by author
GET    /api/feed/trending         - Get trending articles
GET    /api/categories/popular    - Get popular categories (Guest)
```

### 6.4 User Preferences
```
GET    /api/user/preferences      - Get user preferences
POST   /api/user/preferences      - Create user preferences
PUT    /api/user/preferences      - Update user preferences
```

### 6.5 Favorites
```
GET    /api/favorites             - Get user's favorites
POST   /api/favorites             - Add article to favorites
DELETE /api/favorites/:articleId  - Remove from favorites
```

### 6.6 Metadata
```
GET    /api/sources               - List all sources
GET    /api/categories            - List all categories
GET    /api/authors               - List all authors (with filters)
```

### 6.7 Admin/Sync
```
POST   /api/sync                  - Trigger manual sync (protected)
GET    /api/sync/status           - Get sync status
```

---

## 7. Implementation Progress

### 7.1 Backend/Infrastructure ✅

| Component | Status | Progress | Notes |
|-----------|--------|----------|-------|
| Database Schema | ✅ Complete | 100% | All 9 entities defined (User, Article, Source, Category, Author, UserPreference, Favorite, ArticleView, VerificationToken) |
| MikroORM Setup | ✅ Complete | 100% | Config, migrations, seeder working |
| Guardian API Client | ✅ Complete | 100% | Fetching ~50 articles per sync |
| NewsAPI Client | ✅ Complete | 100% | Fetching ~30 articles per sync |
| NY Times Client | ✅ Complete | 100% | Fetching ~24 articles per sync (Top Stories API) |
| Sync Service | ✅ Complete | 100% | Duplicate detection, retry logic, error handling |
| Database Seeder | ✅ Complete | 100% | 104+ articles synced successfully |
| Data Sources | ✅ Complete | 100% | 3 sources integrated (Guardian, NewsAPI, NY Times) |
| Authentication | ❌ Pending | 0% | NextAuth.js setup needed |

### 7.2 API Endpoints 🔄

| Endpoint | Status | Priority | User Type |
|----------|--------|----------|----------|
| POST /api/auth/* | ❌ Pending | High | All |
| GET /api/articles | ❌ Pending | High | All |
| GET /api/articles/:id | ❌ Pending | High | All |
| GET /api/feed/latest | ❌ Pending | High | Guest |
| GET /api/feed/personalized | ❌ Pending | High | Authenticated |
| GET /api/feed/by-category | ❌ Pending | Medium | All |
| GET /api/feed/by-source | ❌ Pending | Medium | All |
| GET /api/categories/popular | ❌ Pending | Medium | Guest |
| POST /api/favorites | ❌ Pending | Medium | Authenticated |
| GET /api/sources | ❌ Pending | Low | All |
| GET /api/categories | ❌ Pending | Low | All |

### 7.3 Frontend Pages 🔄

| Page | Status | Priority | User Type |
|------|--------|----------|----------|
| Page 1A: Home Feed (Authenticated) | ❌ Pending | High | Authenticated |
| Page 1B: Home Feed (Guest) 🆕 | ❌ Pending | High | Guest |
| Page 2: Search & Filter | ❌ Pending | High | All |
| Page 4A: Article Detail (Authenticated) | ❌ Pending | High | Authenticated |
| Page 4B: Article Detail (Guest) 🆕 | ❌ Pending | High | Guest |
| Page 5: Onboarding | ❌ Pending | High | Authenticated |
| Page 7: Login/Signup/Confirm | ❌ Pending | High | All |
| Page 8: Favorites | ❌ Pending | Medium | Authenticated |
| Page 6: Settings | ❌ Pending | Low | Authenticated |

### 7.4 Components 🔄

| Component | Status | Priority |
|-----------|--------|----------|
| Article Card | ❌ Pending | High |
| Hero Carousel | ❌ Pending | High |
| Category Grid | ❌ Pending | High |
| Search Bar | ❌ Pending | High |
| Filter Panel | ❌ Pending | Medium |
| Navigation Bar | ❌ Pending | High |
| Theme Toggle | ❌ Pending | Low |

---

## 8. Future Enhancements

### 8.1 Phase 2 Features
- 📧 Email notifications for new articles in preferred categories
- 🔔 Push notifications (PWA)
- 📊 Reading analytics dashboard
- 💬 Comments/discussions on articles
- 🔗 Social sharing
- 📱 Native mobile apps (React Native)

### 8.2 Phase 3 Features
- 🤖 AI-powered article recommendations
- 📰 Custom RSS feed support
- 🌍 Multi-language support
- 🎙️ Podcast integration
- 📺 Video news integration
- 👥 Social features (follow users, share reading lists)

---

## 9. Development Roadmap

### Sprint 1: Core Backend & Auth (Week 1-2)
- [ ] Setup NextAuth.js
- [ ] Implement authentication endpoints
- [ ] Create user preferences API
- [ ] Setup automated sync (cron job)

### Sprint 2: Core Frontend (Week 3-4)
- [ ] Build authentication pages (Login/Signup)
- [ ] Build onboarding flow
- [ ] Create reusable components (Article Card, etc.)
- [ ] Implement home feed page

### Sprint 3: Search & Discovery (Week 5-6)
- [ ] Build search page with filters
- [ ] Implement article detail page
- [ ] Add favorites functionality
- [ ] Create category browsing

### Sprint 4: Polish & Launch (Week 7-8)
- [ ] Implement settings page
- [ ] Add theme support
- [ ] Performance optimization
- [ ] Mobile responsiveness testing
- [ ] Deploy to production

---

## 10. Technical Decisions

### 10.1 Why These Technologies?

**Next.js 14:**
- Server-side rendering for SEO
- API routes for backend
- File-based routing
- Built-in optimization

**MikroORM:**
- TypeScript-first ORM
- Better type safety than Prisma
- Flexible entity management
- Migration support

**PostgreSQL:**
- Robust relational database
- Full-text search capabilities
- JSON support for flexible data
- Proven scalability

**Tailwind CSS:**
- Rapid UI development
- Consistent design system
- Small bundle size
- Easy theming

---

## 11. Success Metrics

### 11.1 Technical Metrics
- API response time < 200ms
- Page load time < 2s
- Sync success rate > 99%
- Zero data loss during sync
- Mobile performance score > 90

### 11.2 User Metrics
- User signup rate
- Daily active users
- Articles read per session
- Favorite article rate
- Return user rate

---

## Appendix A: API Response Examples

### Article Object
```json
{
  "id": "uuid",
  "title": "Article Title",
  "description": "Article description...",
  "url": "https://...",
  "imageUrl": "https://...",
  "publishedAt": "2025-09-30T12:00:00Z",
  "source": {
    "id": "uuid",
    "name": "The Guardian",
    "slug": "guardian"
  },
  "author": {
    "id": "uuid",
    "name": "John Doe"
  },
  "categories": [
    {
      "id": "uuid",
      "name": "Politics",
      "slug": "politics"
    }
  ],
  "viewCount": 42,
  "isFavorited": false
}
```

### Personalized Feed Response
```json
{
  "articles": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "hasMore": true
  }
}
```

---

**Document Status:** Living Document  
**Next Review:** After Sprint 1 completion  
**Owner:** Development Team
