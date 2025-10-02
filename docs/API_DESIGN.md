# API Design

## Overview

Suhuf provides a RESTful API built with Next.js App Router. All endpoints follow standard REST conventions and return JSON responses.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

Most endpoints require authentication via JWT tokens stored in HTTP-only cookies.

**Authentication Header:**
```
Cookie: next-auth.session-token=<jwt-token>
```

**Unauthenticated Access:**
- Public article listing (limited)
- Article details (view-only)
- Metadata endpoints

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Pagination Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasMore": true
    }
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `EMAIL_ALREADY_EXISTS` | 400 | Email already registered |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `EMAIL_NOT_VERIFIED` | 403 | Email not verified |
| `INVALID_TOKEN` | 400 | Invalid or expired token |

---

## Endpoints

### Authentication

#### POST /api/auth/signup

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Validation:**
- `email`: Valid email format, max 255 chars
- `password`: Min 8 chars, must contain uppercase, lowercase, number, special char
- `name`: Optional, max 100 chars

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "message": "Account created. Please check your email to verify your account.",
    "email": "user@example.com"
  }
}
```

**Errors:**
- `400 EMAIL_ALREADY_EXISTS`: Email already registered
- `400 VALIDATION_ERROR`: Invalid input data

---

#### GET /api/auth/verify-email

Verify user email address.

**Query Parameters:**
- `token` (required): Verification token from email

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully. You can now log in."
  }
}
```

**Errors:**
- `400 INVALID_TOKEN`: Token invalid or expired
- `404 NOT_FOUND`: Token not found

---

#### POST /api/auth/resend-verification

Resend verification email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Verification email sent."
  }
}
```

**Rate Limit:** 3 requests per 15 minutes per email

---

### News

#### GET /api/news

List articles with filtering, searching, and pagination.

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 20, max: 100
- `category` (optional): Category slug (comma-separated for multiple)
- `source` (optional): Source slug (comma-separated for multiple)
- `dateFrom` (optional): ISO date string (e.g., 2024-01-01)
- `dateTo` (optional): ISO date string
- `search` (optional): Search query (title/description)
- `sortBy` (optional): `latest` | `popular`, default: `latest`

**Example Request:**
```
GET /api/news?page=1&limit=20&category=technology,science&source=guardian&search=AI&sortBy=latest
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Article Title",
        "description": "Article description...",
        "url": "https://source.com/article",
        "imageUrl": "https://source.com/image.jpg",
        "publishedAt": "2024-01-15T10:30:00Z",
        "viewCount": 1250,
        "source": {
          "id": "uuid",
          "name": "The Guardian",
          "slug": "guardian",
          "logoUrl": "https://..."
        },
        "author": {
          "id": "uuid",
          "name": "John Smith"
        },
        "categories": [
          {
            "id": "uuid",
            "name": "Technology",
            "slug": "technology"
          }
        ],
        "isFavorite": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "hasMore": true
    }
  }
}
```

**Notes:**
- If user is authenticated, `isFavorite` indicates if article is in their favorites
- Results are personalized based on user preferences (if authenticated)

---

#### GET /api/news/[id]

Get article details by ID.

**Path Parameters:**
- `id`: Article UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Article Title",
    "description": "Full article description...",
    "url": "https://source.com/article",
    "imageUrl": "https://source.com/image.jpg",
    "publishedAt": "2024-01-15T10:30:00Z",
    "viewCount": 1250,
    "source": {
      "id": "uuid",
      "name": "The Guardian",
      "slug": "guardian",
      "logoUrl": "https://..."
    },
    "author": {
      "id": "uuid",
      "name": "John Smith"
    },
    "categories": [
      {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology"
      }
    ],
    "isFavorite": false
  }
}
```

**Errors:**
- `404 NOT_FOUND`: Article not found

---

#### POST /api/news/[id]/view

Track article view (unique per user/IP).

**Path Parameters:**
- `id`: Article UUID

**Request Body:** None

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "viewCount": 1251
  }
}
```

**Notes:**
- For authenticated users: tracked by user ID
- For anonymous users: tracked by IP hash (SHA-256)
- Duplicate views are ignored (idempotent)

---

#### GET /api/news/[id]/similar

Get similar articles (same category).

**Path Parameters:**
- `id`: Article UUID

**Query Parameters:**
- `limit` (optional): Number of results, default: 5, max: 20

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Similar Article",
        "description": "Description...",
        "imageUrl": "https://...",
        "publishedAt": "2024-01-14T08:00:00Z",
        "source": {
          "name": "The Guardian",
          "slug": "guardian"
        }
      }
    ]
  }
}
```

---

### User

#### GET /api/user/preferences

Get user preferences.

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "preferredSources": [
      {
        "id": "uuid",
        "name": "The Guardian",
        "slug": "guardian"
      }
    ],
    "preferredCategories": [
      {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology"
      }
    ],
    "preferredAuthors": [
      {
        "id": "uuid",
        "name": "John Smith"
      }
    ]
  }
}
```

---

#### PUT /api/user/preferences

Update user preferences.

**Authentication:** Required

**Request Body:**
```json
{
  "theme": "dark",
  "preferredSourceIds": ["uuid1", "uuid2"],
  "preferredCategoryIds": ["uuid1", "uuid2"],
  "preferredAuthorIds": ["uuid1", "uuid2"]
}
```

**Validation:**
- `theme`: Must be `light`, `dark`, or `system`
- Arrays: Can be empty (clear preferences)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Preferences updated successfully"
  }
}
```

---

#### GET /api/user/favorites

List user's favorite articles.

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 20, max: 100

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "article": {
          "id": "uuid",
          "title": "Article Title",
          "description": "Description...",
          "imageUrl": "https://...",
          "publishedAt": "2024-01-15T10:30:00Z",
          "source": {
            "name": "The Guardian"
          }
        },
        "createdAt": "2024-01-16T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "hasMore": true
    }
  }
}
```

---

#### POST /api/user/favorites

Add article to favorites.

**Authentication:** Required

**Request Body:**
```json
{
  "articleId": "uuid"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "Article added to favorites"
  }
}
```

**Errors:**
- `400 VALIDATION_ERROR`: Invalid article ID
- `404 NOT_FOUND`: Article not found
- `409 CONFLICT`: Article already in favorites

---

#### DELETE /api/user/favorites/[articleId]

Remove article from favorites.

**Authentication:** Required

**Path Parameters:**
- `articleId`: Article UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Article removed from favorites"
  }
}
```

**Errors:**
- `404 NOT_FOUND`: Favorite not found

---

### Metadata

#### GET /api/metadata/sources

List all active news sources.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "The Guardian",
        "slug": "guardian",
        "logoUrl": "https://..."
      }
    ]
  }
}
```

---

#### GET /api/metadata/categories

List all categories.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology",
        "description": "Tech news and updates"
      }
    ]
  }
}
```

---

#### GET /api/metadata/authors

List authors (optionally filtered by source).

**Query Parameters:**
- `sourceId` (optional): Filter by source UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "John Smith",
        "source": {
          "name": "The Guardian"
        }
      }
    ]
  }
}
```

---

#### GET /api/metadata/popular-categories

Get popular categories (by total view count).

**Query Parameters:**
- `limit` (optional): Number of results, default: 10, max: 20

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology",
        "totalViews": 125000,
        "articleCount": 450
      }
    ]
  }
}
```

---

### Sync (Admin/Cron Only)

These endpoints are protected and only accessible via API key or internal cron jobs.

#### POST /api/sync/sources

Manually sync news sources.

**Authentication:** API Key required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Sources synced successfully",
    "count": 4
  }
}
```

---

#### POST /api/sync/categories

Sync categories from all news APIs.

**Authentication:** API Key required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Categories synced successfully",
    "count": 25
  }
}
```

---

#### POST /api/sync/articles

Sync articles from all news sources.

**Authentication:** API Key required

**Request Body:**
```json
{
  "dateFrom": "2024-01-01",
  "dateTo": "2024-01-15",
  "sources": ["guardian", "newsapi"]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "Articles synced successfully",
    "stats": {
      "guardian": {
        "fetched": 100,
        "created": 95,
        "updated": 5,
        "skipped": 0
      },
      "newsapi": {
        "fetched": 80,
        "created": 75,
        "updated": 3,
        "skipped": 2
      }
    }
  }
}
```

---

## Rate Limiting

### General Endpoints
- **Limit**: 100 requests per 15 minutes per IP
- **Header**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Authentication Endpoints
- **Limit**: 5 requests per 15 minutes per IP
- Stricter limits to prevent brute force attacks

### Authenticated Users
- **Limit**: 1000 requests per 15 minutes per user
- Higher limits for logged-in users

### Rate Limit Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 900
  }
}
```

---

## CORS Policy

- **Development**: Allow all origins
- **Production**: Whitelist specific domains

```typescript
{
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}
```

---

## Webhooks (Future)

### POST /api/webhooks/article-published

Notify when new articles are synced.

**Payload:**
```json
{
  "event": "article.published",
  "data": {
    "articleId": "uuid",
    "title": "Article Title",
    "source": "guardian",
    "publishedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## API Versioning

Currently using v1 (implicit). Future versions will use URL versioning:
- `/api/v1/news`
- `/api/v2/news`

---

## Testing

### Example cURL Requests

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

**List Articles:**
```bash
curl http://localhost:3000/api/news?page=1&limit=10&category=technology
```

**Add Favorite:**
```bash
curl -X POST http://localhost:3000/api/user/favorites \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<token>" \
  -d '{"articleId":"uuid"}'
```

---

## Conclusion

This API provides a comprehensive interface for the news aggregator platform with:
- RESTful design principles
- Consistent response formats
- Proper error handling
- Rate limiting for security
- Authentication and authorization
- Pagination for large datasets
