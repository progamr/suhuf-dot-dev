# System Architecture

## Overview

Suhuf is a full-stack news aggregator application built with a modern, scalable architecture. The system follows a modular design pattern with clear separation of concerns between frontend, backend, and data layers.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │   Tablet     │          │
│  │  (React UI)  │  │   (Future)   │  │  (Responsive)│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Application                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    App Router (Pages)                      │  │
│  │  • (auth): Login, Signup, Verify Email                    │  │
│  │  • (main): Home, News List, Article Detail, Preferences   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Routes Layer                        │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │  │
│  │  │  Auth   │  │  News   │  │  User   │  │  Sync   │     │  │
│  │  │  APIs   │  │  APIs   │  │  APIs   │  │  APIs   │     │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Business Logic Layer                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │ Auth Module  │  │ News Module  │  │ User Module  │    │  │
│  │  │ • Services   │  │ • Services   │  │ • Services   │    │  │
│  │  │ • Queries    │  │ • Queries    │  │ • Queries    │    │  │
│  │  │ • Utils      │  │ • Utils      │  │ • Utils      │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    MikroORM (ORM)                          │  │
│  │  • Entities  • Repositories  • Migrations                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  PostgreSQL Database                       │  │
│  │  • Users  • Articles  • Sources  • Categories             │  │
│  │  • Preferences  • Favorites  • Views                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Guardian    │  │   NewsAPI    │  │   NY Times   │          │
│  │     API      │  │     API      │  │     API      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   BBC API    │  │   SMTP       │                            │
│  │  (Unofficial)│  │  (Email)     │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. News Sync Flow (Background Job)

```
┌─────────────┐
│  node-cron  │ (Runs every hour)
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Sync Service   │
└──────┬──────────┘
       │
       ├─────► Fetch from Guardian API
       ├─────► Fetch from NewsAPI
       ├─────► Fetch from NY Times API
       └─────► Fetch from BBC API
       │
       ▼
┌─────────────────┐
│  Process Data   │
│  • Normalize    │
│  • Deduplicate  │
│  • Extract Meta │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Save to DB     │
│  • Articles     │
│  • Categories   │
│  • Authors      │
└─────────────────┘
```

### 2. User Authentication Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ POST /api/auth/signup
       ▼
┌──────────────────┐
│  Signup Handler  │
│  • Validate      │
│  • Hash Password │
│  • Create User   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Email Service   │
│  • Generate Token│
│  • Send Email    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   User Clicks    │
│  Verify Link     │
└──────┬───────────┘
       │ GET /api/auth/verify-email?token=xxx
       ▼
┌──────────────────┐
│  Verify Handler  │
│  • Validate Token│
│  • Update User   │
│  • emailVerified │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Redirect to     │
│  Login Page      │
└──────────────────┘
```

### 3. Article Viewing Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ GET /article/[id]
       ▼
┌──────────────────┐
│  Article Page    │
│  • Fetch Metadata│
│    from DB       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Track View      │
│  POST /api/news/ │
│  [id]/view       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Display Article │
│  • Metadata      │
│  • Content (DB)  │
│  • Similar News  │
└──────────────────┘
```

### 4. Personalized Feed Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ GET /api/news?filters
       ▼
┌──────────────────┐
│  News Handler    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Get User Prefs  │
│  • Sources       │
│  • Categories    │
│  • Authors       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Query Articles  │
│  • Filter by     │
│    Preferences   │
│  • Pagination    │
│  • Sort by Date  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Return Results  │
│  • Articles[]    │
│  • Total Count   │
│  • Has More      │
└──────────────────┘
```

## Key Design Decisions

### 1. Hybrid Article Storage

**Decision**: Store article metadata in DB, full content synced from APIs

**Rationale**:
- Fast querying and filtering (metadata in DB)
- Reduced storage requirements (no full content)
- Manageable sync jobs (metadata only)
- Avoid API rate limits for browsing
- Can display articles even if API is temporarily down

**Trade-offs**:
- Need periodic sync jobs
- Slight data staleness (acceptable for news)

### 2. JWT Authentication Strategy

**Decision**: Use JWT tokens instead of database sessions

**Rationale**:
- Stateless authentication (no session table)
- Scalable (no session storage)
- Simpler architecture
- Sufficient security for news aggregator

**Trade-offs**:
- Cannot revoke tokens before expiration
- Slightly larger cookie size

### 3. Modular Architecture

**Decision**: Organize code by feature modules (auth, news, user)

**Rationale**:
- Clear separation of concerns
- Easy to locate and maintain code
- Scalable for future features
- Reusable components and hooks

**Structure**:
```
modules/
  auth/
    components/
    hooks/
    queries/
    services/
    utils/
    consts/
```

### 4. API Route Organization

**Decision**: RESTful API routes with Next.js App Router

**Rationale**:
- Standard REST conventions
- Easy to understand and document
- Built-in with Next.js (no separate server)
- Serverless-ready

**Examples**:
- `GET /api/news` - List articles
- `GET /api/news/[id]` - Get article
- `POST /api/news/[id]/view` - Track view
- `POST /api/user/favorites` - Add favorite

### 5. Database Schema Design

**Decision**: Normalized relational schema with junction tables

**Rationale**:
- Efficient many-to-many relationships
- Data integrity with foreign keys
- Optimized queries with indexes
- Standard SQL patterns

**Key Relationships**:
- User ↔ Favorite ↔ Article (many-to-many)
- Article ↔ ArticleCategory ↔ Category (many-to-many)
- User ↔ UserPreferredSource ↔ Source (many-to-many)

### 6. Background Job Strategy

**Decision**: Use node-cron for periodic sync

**Rationale**:
- Simple setup (no Redis required)
- Sufficient for hourly sync
- Runs within Next.js process
- Easy to monitor and debug

**Trade-offs**:
- Not suitable for high-frequency jobs
- Single instance only (no distributed jobs)

### 7. Security-First Approach

**Decision**: Multiple layers of security measures

**Implementation**:
- Rate limiting on all endpoints
- Input validation with Zod
- HTML sanitization with DOMPurify
- CSRF protection via Auth.js
- Secure password hashing (bcrypt)
- Email verification required
- HTTP-only, Secure cookies

### 8. Performance Optimizations

**Strategies**:
- Infinite scroll with virtualization
- Database indexes on frequently queried fields
- Debounced search (300ms)
- Lazy loading of components
- Next.js Image optimization
- Pagination for large lists

## Technology Choices

### Frontend

**Next.js 14+ (App Router)**
- Server-side rendering for SEO
- API routes for backend
- Built-in optimizations
- TypeScript support

**TanStack Query**
- Server state management
- Automatic caching
- Optimistic updates
- Infinite queries support

**shadcn/ui + Tailwind**
- Modern, accessible components
- Customizable design system
- Utility-first CSS
- Dark mode support

### Backend

**MikroORM**
- TypeScript-first ORM
- Type-safe queries
- Migration system
- Active Record pattern

**Auth.js v5**
- Industry-standard authentication
- JWT support
- CSRF protection
- Extensible providers

**PostgreSQL**
- Robust relational database
- ACID compliance
- Full-text search capabilities
- JSON support for flexibility

### External APIs

**The Guardian API**
- Comprehensive news coverage
- Well-documented API
- Reliable uptime
- 5,000 calls/day (free)

**NewsAPI.org**
- Multi-source aggregation
- Category support
- 100 calls/day (free)

**NY Times API**
- Premium content
- Rich metadata
- 4,000 calls/day

**BBC News API**
- Trusted source
- Global coverage
- Unofficial API

## Scalability Considerations

### Current Architecture (MVP)

- Single Next.js instance
- PostgreSQL database
- Periodic sync jobs
- No caching layer

### Future Scaling Options

1. **Horizontal Scaling**
   - Multiple Next.js instances behind load balancer
   - Shared PostgreSQL database
   - Distributed cron jobs (BullMQ + Redis)

2. **Caching Layer**
   - Redis for article content caching
   - Reduce API calls
   - Faster response times

3. **Database Optimization**
   - Read replicas for queries
   - Connection pooling
   - Materialized views for analytics

4. **CDN Integration**
   - Static asset delivery
   - Image optimization
   - Edge caching

5. **Microservices (Future)**
   - Separate sync service
   - Dedicated search service
   - Analytics service

## Monitoring & Observability

### Logging Strategy

- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Request/response logging
- Error tracking with stack traces

### Metrics to Track

- API response times
- Database query performance
- Sync job success/failure rates
- User registration/login rates
- Article view counts
- Error rates by endpoint

### Health Checks

- Database connectivity
- External API availability
- Disk space usage
- Memory usage

## Deployment Architecture

### Docker Containers

```
┌─────────────────────────────────────┐
│         Hostinger VPS               │
│  ┌───────────────────────────────┐  │
│  │      Nginx (Reverse Proxy)    │  │
│  │      • SSL Termination        │  │
│  │      • Rate Limiting          │  │
│  └───────────────────────────────┘  │
│                 │                    │
│  ┌───────────────────────────────┐  │
│  │    Next.js Container          │  │
│  │    • App Server               │  │
│  │    • API Routes               │  │
│  │    • Cron Jobs                │  │
│  └───────────────────────────────┘  │
│                 │                    │
│  ┌───────────────────────────────┐  │
│  │   PostgreSQL Container        │  │
│  │   • Database                  │  │
│  │   • Persistent Volume         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Environment Separation

- **Development**: Local machine with hot reload
- **Staging**: Docker containers on VPS (staging subdomain)
- **Production**: Docker containers on VPS (main domain)

## Security Architecture

### Defense in Depth

1. **Network Layer**
   - Firewall rules
   - DDoS protection
   - SSL/TLS encryption

2. **Application Layer**
   - Rate limiting
   - CSRF tokens
   - XSS prevention
   - Input validation

3. **Data Layer**
   - Encrypted passwords
   - Parameterized queries
   - Database access controls

4. **Authentication Layer**
   - JWT tokens
   - Email verification
   - Secure cookies
   - Password policies

## Conclusion

This architecture provides a solid foundation for a scalable, secure, and maintainable news aggregator platform. The modular design allows for easy feature additions and future enhancements while maintaining code quality and performance.
