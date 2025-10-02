# Suhuf - News Aggregator Platform

A modern news aggregator built with **React.js (Next.js 14)** and **TypeScript**, aggregating articles from multiple news sources.

## 📋 Challenge Requirements

This project fulfills the following technical assessment requirements:

### ✅ Frontend Technology Stack
- **React.js** with **TypeScript** - Type-safe React application
- **Next.js 14** - React framework with App Router
- **TanStack Query** - Server state management
- **Tailwind CSS** + **shadcn/ui** - Modern UI components

### ✅ Data Sources (3+ Required)
The application aggregates news from **4 sources**:
1. **The Guardian API**
2. **NewsAPI**
3. **New York Times API**
4. **BBC News RSS**

### ✅ Docker Containerization
- Fully containerized with Docker
- Docker Compose for multi-container orchestration
- Clear documentation for running in containers (see below)

### ✅ Software Development Best Practices

#### **DRY (Don't Repeat Yourself)**
- Reusable components in `/src/components` and `/src/modules/*/components`
- Shared utilities and hooks
- Centralized API constants and request functions

#### **KISS (Keep It Simple, Stupid)**
- Clear folder structure by feature modules
- Simple, focused components with single responsibilities
- Straightforward data flow with React Query

#### **SOLID Principles**
- **Single Responsibility**: Each component/module has one clear purpose
- **Open/Closed**: Components extensible through props, closed for modification
- **Liskov Substitution**: Consistent interfaces across similar components
- **Interface Segregation**: Focused prop interfaces, no bloated components
- **Dependency Inversion**: Components depend on abstractions (hooks, services)

## 🏗️ Architecture

### Module-Based Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # Shared UI components
├── infrastructure/         # Core infrastructure (DB, auth, entities)
└── modules/               # Feature modules
    ├── auth/              # Authentication module
    │   ├── components/
    │   ├── state/
    │   │   ├── requests/
    │   │   ├── queries/
    │   │   └── mutations/
    │   ├── services/
    │   └── validation/
    ├── feed/              # News feed module
    │   ├── components/
    │   │   ├── ArticlesList/
    │   │   ├── ArticleDetail/
    │   │   ├── PersonalizedFeed/
    │   │   └── PublicFeed/
    │   └── state/
    │       ├── requests/
    │       ├── queries/
    │       └── mutations/
    └── onboarding/        # User onboarding module
        ├── components/
        ├── state/
        └── validation/
```

### Key Features
- **Authentication**: Email/password with JWT and email verification
- **Personalized Feed**: User preferences for sources, categories, and authors
- **Advanced Filtering**: Search, filter by category/source/author/date
- **Infinite Scroll**: Optimized article loading
- **Article Management**: Favorites, view tracking, sharing
- **Responsive Design**: Mobile-first, dark mode support

## 🐳 Running with Docker

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd suhuf-dev
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

3. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:3000
- Database: PostgreSQL on localhost:5432

### Docker Commands

```bash
# Start containers
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Run database migrations
docker-compose exec app npm run db:migrate
```

## 🚀 Local Development (Without Docker)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Configure your .env file
```

3. **Set up database**
```bash
npm run db:migrate
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

## 📦 Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/suhuf

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# API Keys
GUARDIAN_API_KEY=your-guardian-api-key
NEWSAPI_KEY=your-newsapi-key
NYTIMES_API_KEY=your-nytimes-api-key

# Email (for verification)
EMAIL_FROM=noreply@suhuf.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📚 Documentation

- **Implementation Status**: See `/docs/IMPLEMENTATION_STATUS.md` for detailed feature implementation status
- **API Documentation**: Available at `/api/docs` when running the app

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- React 18
- TanStack Query (React Query)
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod

### Backend
- Next.js API Routes
- MikroORM
- PostgreSQL
- NextAuth.js
- bcrypt
- node-cron

### DevOps
- Docker & Docker Compose
- ESLint & Prettier
- Husky (Git hooks)

## 📄 License

MIT

## 👤 Author

Built as a technical assessment demonstrating modern React/TypeScript development with best practices.
