# Suhuf - News Aggregator Platform

A modern, full-stack news aggregator application built with Next.js 14, TypeScript, and PostgreSQL. Aggregates news from multiple sources (The Guardian, NewsAPI, NY Times, BBC) and provides a personalized news reading experience.

## 🚀 Features

### Authentication
- Email/password registration with verification
- JWT-based authentication
- Secure password hashing with bcrypt
- Email verification system

### News Aggregation
- Multi-source news aggregation (Guardian, NewsAPI, NY Times, BBC)
- Automated sync with node-cron
- Category and author management
- Duplicate article prevention

### User Experience
- Personalized news feed based on preferences
- Advanced filtering (category, source, date range)
- Real-time search with debouncing
- Infinite scroll with virtualization
- Latest news carousel
- Popular categories showcase

### Article Features
- Detailed article view
- Unique view tracking
- Favorite/unfavorite articles
- Share functionality (copy link)
- Similar articles recommendations

### User Preferences
- Theme selection (light/dark/system)
- Preferred sources selection
- Preferred categories selection
- Preferred authors selection
- Manage favorite articles

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - UI component library
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **react-intersection-observer** - Infinite scroll
- **@tanstack/react-virtual** - List virtualization

### Backend
- **Next.js API Routes** - Serverless API
- **MikroORM** - TypeScript ORM
- **PostgreSQL** - Database
- **Auth.js v5** - Authentication (JWT strategy)
- **node-cron** - Background job scheduling
- **Nodemailer** - Email sending
- **bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn
- Docker & Docker Compose (for deployment)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd suhuf-dev
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/suhuf

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@suhuf.com

# News APIs
GUARDIAN_API_KEY=your-guardian-api-key
NEWSAPI_KEY=your-newsapi-key
NYTIMES_API_KEY=your-nytimes-api-key
BBC_API_URL=https://bbc-news-api.vercel.app

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

Create PostgreSQL database:

```bash
createdb suhuf
```

Run migrations:

```bash
npm run migration:up
```

### 5. Initial Data Sync

Sync sources, categories, and initial articles:

```bash
npm run sync:initial
```

This will:
- Create news sources in the database
- Fetch and sync categories from APIs
- Sync articles from the last 7 days
- Display progress and completion status

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
suhuf-dev/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, signup, verify)
│   │   ├── (main)/            # Main app pages (home, news, article, preferences)
│   │   ├── api/               # API routes
│   │   └── ui/                # Shared UI components
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── news/              # News module
│   │   └── user/              # User module
│   ├── lib/                   # Shared libraries
│   │   ├── db/                # Database configuration
│   │   ├── auth/              # Auth configuration
│   │   ├── api/               # External API clients
│   │   ├── middleware/        # Custom middleware
│   │   └── utils/             # Utility functions
│   ├── entities/              # MikroORM entities
│   └── types/                 # TypeScript types
├── scripts/                   # Utility scripts
├── docs/                      # Documentation
├── docker/                    # Docker configuration
└── public/                    # Static assets
```

## 🔐 Security Features

- **Rate Limiting**: IP-based rate limiting on all endpoints
- **CSRF Protection**: Built-in CSRF tokens via Auth.js
- **XSS Prevention**: Input sanitization with DOMPurify
- **SQL Injection**: Parameterized queries via MikroORM
- **Password Security**: bcrypt with cost factor 12
- **JWT Security**: HTTP-only, Secure, SameSite cookies
- **Email Verification**: Required before account activation
- **Input Validation**: Zod schemas on all inputs

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run migration:create # Create new migration
npm run migration:up     # Run migrations
npm run migration:down   # Rollback migrations

# Sync
npm run sync:initial     # Initial data sync (run once)
npm run sync:cron        # Start cron job for periodic sync

# Docker
npm run docker:build     # Build Docker image
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
```

## 🌐 API Documentation

See [docs/API_DESIGN.md](docs/API_DESIGN.md) for complete API documentation.

### Key Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/news` - List articles with filters
- `GET /api/news/[id]` - Get article details
- `POST /api/news/[id]/view` - Track article view
- `GET /api/user/preferences` - Get user preferences
- `POST /api/user/favorites` - Add article to favorites

## 🗄️ Database Schema

See [docs/DATABASE.md](docs/DATABASE.md) for complete database schema.

### Core Entities

- **User** - User accounts
- **Article** - News articles (metadata only)
- **Source** - News sources (Guardian, NewsAPI, etc.)
- **Category** - Article categories
- **Author** - Article authors
- **Favorite** - User's favorite articles
- **UserPreference** - User preferences (theme, sources, categories)

## 🚢 Deployment

### Docker Deployment

1. Build the image:

```bash
docker-compose build
```

2. Start containers:

```bash
docker-compose up -d
```

3. Run initial sync:

```bash
docker-compose exec app npm run sync:initial
```

### Hostinger VPS Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) - System architecture and design decisions
- [Database Schema](docs/DATABASE.md) - Complete database schema
- [API Design](docs/API_DESIGN.md) - API endpoints and specifications
- [Security](docs/SECURITY.md) - Security measures and best practices
- [Deployment](docs/DEPLOYMENT.md) - Deployment guide for Hostinger VPS
- [Development](docs/DEVELOPMENT.md) - Development guidelines and conventions

## 🤝 Contributing

This is a technical assessment project that will be transformed into a personal blog.

## 📝 License

Private project for technical assessment purposes.

## 🔮 Future Enhancements

- [ ] Article content caching strategy
- [ ] Real-time notifications
- [ ] Social sharing integrations
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] RSS feed generation
- [ ] Newsletter functionality
- [ ] Comment system

## 📧 Contact

For questions or feedback, please contact the project maintainer.

---

**Built with ❤️ using Next.js and TypeScript**
