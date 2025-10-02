# Database Schema

## Overview

Suhuf uses PostgreSQL as its primary database with MikroORM as the ORM layer. The schema is designed for a news aggregator with user preferences, favorites, and view tracking.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│    User     │────────▶│ UserPreference   │         │   Source    │
│             │         │                  │         │             │
│ id          │         │ id               │         │ id          │
│ email       │         │ userId (FK)      │         │ name        │
│ password    │         │ theme            │         │ slug        │
│ verified    │         └──────────────────┘         │ apiId       │
└──────┬──────┘                                      └──────┬──────┘
       │                                                     │
       │         ┌──────────────────────┐                   │
       └────────▶│ UserPreferredSource  │◀──────────────────┘
       │         │                      │
       │         │ userId (FK)          │
       │         │ sourceId (FK)        │
       │         └──────────────────────┘
       │
       │         ┌──────────────────────┐         ┌─────────────┐
       └────────▶│ UserPreferredCategory│◀────────│  Category   │
       │         │                      │         │             │
       │         │ userId (FK)          │         │ id          │
       │         │ categoryId (FK)      │         │ name        │
       │         └──────────────────────┘         │ slug        │
       │                                          └──────┬──────┘
       │                                                 │
       │         ┌──────────────────────┐               │
       └────────▶│ UserPreferredAuthor  │               │
       │         │                      │               │
       │         │ userId (FK)          │               │
       │         │ authorId (FK)        │               │
       │         └──────────────────────┘               │
       │                  │                             │
       │                  │                             │
       │                  ▼                             │
       │         ┌─────────────┐                        │
       │         │   Author    │                        │
       │         │             │                        │
       │         │ id          │                        │
       │         │ name        │                        │
       │         │ sourceId    │                        │
       │         │ externalId  │                        │
       │         └──────┬──────┘                        │
       │                │                               │
       │                │                               │
       │                ▼                               │
       │         ┌─────────────┐         ┌──────────────────────┐
       │         │   Article   │◀────────│  ArticleCategory     │
       │         │             │         │                      │
       │         │ id          │         │ articleId (FK)       │
       │         │ title       │         │ categoryId (FK)      │
       │         │ description │         └──────────────────────┘
       │         │ url         │                   ▲
       │         │ imageUrl    │                   │
       │         │ publishedAt │                   └──────────────┘
       │         │ sourceId    │
       │         │ authorId    │
       │         │ externalId  │
       │         │ viewCount   │
       │         └──────┬──────┘
       │                │
       │                │
       │         ┌──────▼──────┐
       └────────▶│  Favorite   │
       │         │             │
       │         │ id          │
       │         │ userId (FK) │
       │         │ articleId   │
       │         └─────────────┘
       │
       │         ┌─────────────┐
       └────────▶│ ArticleView │
                 │             │
                 │ id          │
                 │ articleId   │
                 │ userId      │
                 │ ipHash      │
                 └─────────────┘

┌──────────────────────┐
│ VerificationToken    │
│                      │
│ id                   │
│ identifier (email)   │
│ token                │
│ expires              │
└──────────────────────┘
```

## Entities

### 1. User

Stores user account information.

```typescript
{
  id: string (UUID, Primary Key)
  email: string (Unique, Indexed)
  emailVerified: Date | null
  name: string | null
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `idx_user_email` on `email` (unique)

**Relationships:**
- One-to-One with `UserPreference`
- One-to-Many with `Favorite`
- One-to-Many with `ArticleView`
- Many-to-Many with `Source` (via `UserPreferredSource`)
- Many-to-Many with `Category` (via `UserPreferredCategory`)
- Many-to-Many with `Author` (via `UserPreferredAuthor`)

---

### 2. VerificationToken

Stores email verification tokens.

```typescript
{
  id: string (UUID, Primary Key)
  identifier: string (email, Indexed)
  token: string (Unique, Indexed)
  expires: Date
  createdAt: Date
}
```

**Indexes:**
- `idx_verification_token` on `token` (unique)
- `idx_verification_identifier` on `identifier`

---

### 3. Source

Stores news sources (Guardian, NewsAPI, NY Times, BBC).

```typescript
{
  id: string (UUID, Primary Key)
  name: string (Unique)
  slug: string (Unique, Indexed)
  apiIdentifier: string (guardian | newsapi | nytimes | bbc)
  logoUrl: string | null
  isActive: boolean (default: true)
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `idx_source_slug` on `slug` (unique)
- `idx_source_active` on `isActive`

**Relationships:**
- One-to-Many with `Article`
- One-to-Many with `Author`
- Many-to-Many with `User` (via `UserPreferredSource`)

**Sample Data:**
```sql
INSERT INTO source (id, name, slug, api_identifier, is_active) VALUES
  ('uuid-1', 'The Guardian', 'guardian', 'guardian', true),
  ('uuid-2', 'NewsAPI.org', 'newsapi', 'newsapi', true),
  ('uuid-3', 'The New York Times', 'nytimes', 'nytimes', true),
  ('uuid-4', 'BBC News', 'bbc', 'bbc', true);
```

---

### 4. Category

Stores article categories (e.g., Technology, Sports, Politics).

```typescript
{
  id: string (UUID, Primary Key)
  name: string (Unique)
  slug: string (Unique, Indexed)
  description: string | null
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `idx_category_slug` on `slug` (unique)

**Relationships:**
- Many-to-Many with `Article` (via `ArticleCategory`)
- Many-to-Many with `User` (via `UserPreferredCategory`)

---

### 5. Author

Stores article authors.

```typescript
{
  id: string (UUID, Primary Key)
  name: string
  sourceId: string (Foreign Key to Source)
  externalId: string | null (ID from source API)
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `idx_author_source` on `sourceId`
- `idx_author_unique` on `(sourceId, externalId)` (unique)

**Relationships:**
- Many-to-One with `Source`
- One-to-Many with `Article`
- Many-to-Many with `User` (via `UserPreferredAuthor`)

---

### 6. Article

Stores article metadata (hybrid approach - no full content).

```typescript
{
  id: string (UUID, Primary Key)
  title: string
  description: string (snippet/summary)
  url: string (Unique, Indexed) // Original article URL
  imageUrl: string | null
  publishedAt: Date (Indexed DESC)
  sourceId: string (Foreign Key to Source, Indexed)
  authorId: string | null (Foreign Key to Author)
  externalId: string (ID from source API)
  viewCount: number (default: 0, Indexed DESC)
  lastSyncedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `idx_article_url` on `url` (unique)
- `idx_article_published` on `publishedAt DESC`
- `idx_article_source` on `sourceId`
- `idx_article_view_count` on `viewCount DESC`
- `idx_article_unique` on `(sourceId, externalId)` (unique)

**Relationships:**
- Many-to-One with `Source`
- Many-to-One with `Author` (nullable)
- Many-to-Many with `Category` (via `ArticleCategory`)
- One-to-Many with `Favorite`
- One-to-Many with `ArticleView`

**Notes:**
- `url` is the original article URL (for "Read Full Article" link)
- `externalId` is the unique ID from the source API
- `viewCount` is incremented via `ArticleView` tracking
- No full content stored (fetched from API when needed)

---

### 7. ArticleCategory

Junction table for Article-Category many-to-many relationship.

```typescript
{
  articleId: string (Foreign Key to Article)
  categoryId: string (Foreign Key to Category)
  // Composite Primary Key: (articleId, categoryId)
}
```

**Indexes:**
- `pk_article_category` on `(articleId, categoryId)` (primary key)
- `idx_article_category_article` on `articleId`
- `idx_article_category_category` on `categoryId`

---

### 8. UserPreference

Stores user preferences (theme, etc.).

```typescript
{
  id: string (UUID, Primary Key)
  userId: string (Foreign Key to User, Unique)
  theme: 'light' | 'dark' | 'system' (default: 'system')
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `idx_user_preference_user` on `userId` (unique)

**Relationships:**
- One-to-One with `User`

---

### 9. UserPreferredSource

Junction table for User-Source preferences.

```typescript
{
  userId: string (Foreign Key to User)
  sourceId: string (Foreign Key to Source)
  // Composite Primary Key: (userId, sourceId)
}
```

**Indexes:**
- `pk_user_preferred_source` on `(userId, sourceId)` (primary key)

---

### 10. UserPreferredCategory

Junction table for User-Category preferences.

```typescript
{
  userId: string (Foreign Key to User)
  categoryId: string (Foreign Key to Category)
  // Composite Primary Key: (userId, categoryId)
}
```

**Indexes:**
- `pk_user_preferred_category` on `(userId, categoryId)` (primary key)

---

### 11. UserPreferredAuthor

Junction table for User-Author preferences.

```typescript
{
  userId: string (Foreign Key to User)
  authorId: string (Foreign Key to Author)
  // Composite Primary Key: (userId, authorId)
}
```

**Indexes:**
- `pk_user_preferred_author` on `(userId, authorId)` (primary key)

---

### 12. Favorite

Stores user's favorite articles.

```typescript
{
  id: string (UUID, Primary Key)
  userId: string (Foreign Key to User, Indexed)
  articleId: string (Foreign Key to Article)
  createdAt: Date (Indexed DESC)
}
```

**Indexes:**
- `idx_favorite_user` on `userId`
- `idx_favorite_created` on `createdAt DESC`
- `idx_favorite_unique` on `(userId, articleId)` (unique)

**Relationships:**
- Many-to-One with `User`
- Many-to-One with `Article`

---

### 13. ArticleView

Tracks unique article views (for view count).

```typescript
{
  id: string (UUID, Primary Key)
  articleId: string (Foreign Key to Article, Indexed)
  userId: string | null (Foreign Key to User)
  ipHash: string | null (SHA-256 hash of IP for anonymous users)
  createdAt: Date
}
```

**Indexes:**
- `idx_article_view_article` on `articleId`
- `idx_article_view_user` on `(articleId, userId)` (unique, partial: WHERE userId IS NOT NULL)
- `idx_article_view_ip` on `(articleId, ipHash)` (unique, partial: WHERE ipHash IS NOT NULL)

**Relationships:**
- Many-to-One with `Article`
- Many-to-One with `User` (nullable)

**Notes:**
- For authenticated users: `userId` is set, `ipHash` is null
- For anonymous users: `ipHash` is set, `userId` is null
- Unique constraint ensures one view per user/IP per article
- View count is calculated by counting rows in this table

---

## Database Queries

### Common Queries

#### 1. Get Personalized News Feed

```sql
SELECT a.*, s.name as source_name, s.logo_url
FROM article a
JOIN source s ON a.source_id = s.id
WHERE a.source_id IN (
  SELECT source_id FROM user_preferred_source WHERE user_id = ?
)
AND EXISTS (
  SELECT 1 FROM article_category ac
  WHERE ac.article_id = a.id
  AND ac.category_id IN (
    SELECT category_id FROM user_preferred_category WHERE user_id = ?
  )
)
ORDER BY a.published_at DESC
LIMIT 20 OFFSET ?;
```

#### 2. Get Popular Categories

```sql
SELECT c.*, SUM(a.view_count) as total_views
FROM category c
JOIN article_category ac ON c.id = ac.category_id
JOIN article a ON ac.article_id = a.id
GROUP BY c.id
ORDER BY total_views DESC
LIMIT 10;
```

#### 3. Get Similar Articles

```sql
SELECT a.*, s.name as source_name
FROM article a
JOIN source s ON a.source_id = s.id
JOIN article_category ac ON a.id = ac.article_id
WHERE ac.category_id IN (
  SELECT category_id FROM article_category WHERE article_id = ?
)
AND a.id != ?
ORDER BY a.published_at DESC
LIMIT 5;
```

#### 4. Track Unique View

```sql
-- For authenticated user
INSERT INTO article_view (id, article_id, user_id, created_at)
VALUES (uuid_generate_v4(), ?, ?, NOW())
ON CONFLICT (article_id, user_id) DO NOTHING;

-- For anonymous user
INSERT INTO article_view (id, article_id, ip_hash, created_at)
VALUES (uuid_generate_v4(), ?, ?, NOW())
ON CONFLICT (article_id, ip_hash) DO NOTHING;

-- Update view count
UPDATE article
SET view_count = (SELECT COUNT(*) FROM article_view WHERE article_id = ?)
WHERE id = ?;
```

#### 5. Search Articles

```sql
SELECT a.*, s.name as source_name
FROM article a
JOIN source s ON a.source_id = s.id
WHERE 
  a.title ILIKE ? OR a.description ILIKE ?
ORDER BY a.published_at DESC
LIMIT 20 OFFSET ?;
```

---

## Migration Strategy

### Initial Migration

```typescript
// Create all tables with proper constraints and indexes
await orm.schema.createSchema();
```

### Seed Data

```typescript
// Seed sources
const sources = [
  { name: 'The Guardian', slug: 'guardian', apiIdentifier: 'guardian' },
  { name: 'NewsAPI.org', slug: 'newsapi', apiIdentifier: 'newsapi' },
  { name: 'The New York Times', slug: 'nytimes', apiIdentifier: 'nytimes' },
  { name: 'BBC News', slug: 'bbc', apiIdentifier: 'bbc' },
];

for (const source of sources) {
  await orm.em.persistAndFlush(new Source(source));
}
```

---

## Performance Considerations

### Indexes

All frequently queried fields have indexes:
- `article.publishedAt` (DESC) - for latest news
- `article.viewCount` (DESC) - for popular articles
- `article.sourceId` - for filtering by source
- `favorite.userId` - for user's favorites
- `article_view.articleId` - for view tracking

### Query Optimization

- Use `LIMIT` and `OFFSET` for pagination
- Use `EXISTS` instead of `IN` for large subqueries
- Use partial indexes for conditional uniqueness
- Use composite indexes for multi-column queries

### Data Retention

- Keep articles for 90 days (configurable)
- Archive old articles to separate table
- Clean up expired verification tokens daily

---

## Backup Strategy

### Daily Backups

```bash
pg_dump -U postgres -d suhuf > backup_$(date +%Y%m%d).sql
```

### Retention Policy

- Daily backups: Keep for 7 days
- Weekly backups: Keep for 4 weeks
- Monthly backups: Keep for 12 months

---

## Database Configuration

### Connection Pool

```typescript
{
  min: 2,
  max: 10,
  acquireTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
}
```

### MikroORM Configuration

```typescript
{
  entities: ['./src/entities'],
  dbName: 'suhuf',
  type: 'postgresql',
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './migrations',
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
}
```

---

## Conclusion

This database schema provides a solid foundation for the news aggregator platform with:
- Efficient querying through proper indexing
- Data integrity through foreign key constraints
- Scalability through normalized design
- Flexibility for future enhancements
