# Suhuf - News Aggregator Platform

A modern, personalized news aggregator built with **Next.js 15**, **TypeScript**, and **MikroORM**. Aggregates articles from multiple trusted news sources with advanced filtering, personalization, and user authentication.

## 📋 Challenge Requirements

This project fulfills the following technical assessment requirements:

### ✅ Technology Stack
- **Next.js 15** with **App Router** - Modern React framework
- **TypeScript** - Full type safety across the application
- **TanStack Query (React Query)** - Server state management
- **MikroORM** - Type-safe ORM with PostgreSQL
- **NextAuth.js** - Authentication and authorization
- **Tailwind CSS** + **shadcn/ui** - Modern, accessible UI components

### ✅ Data Sources (3 Sources)
1. **The Guardian API** - UK news and international coverage
2. **NewsAPI** - Global news aggregation
3. **New York Times API** - Premium journalism

### ✅ Docker Containerization
- **Fully containerized** with Docker and Docker Compose
- **Automated migrations** on container startup
- **Hot reload** for development
- **PostgreSQL 15** database container
- **One-command setup** for reviewers

### ✅ Best Practices Implemented

#### **DRY (Don't Repeat Yourself)**
- Reusable UI components and hooks
- Centralized API services and request handlers
- Shared validation schemas with Zod

#### **KISS (Keep It Simple, Stupid)**
- Feature-based module structure
- Single-responsibility components
- Clear separation of concerns (UI, state, services)

#### **Additional Practices**
- **Type Safety**: TypeScript throughout with strict mode
- **Code Quality**: ESLint, consistent formatting
- **Database Migrations**: Version-controlled schema changes
- **Security**: Password hashing, JWT tokens, CSRF protection

## 🏗️ Architecture & Features

### Module-Based Structure
```
src/
├── app/                    # Next.js 15 App Router
├── components/             # Shared UI components
├── infrastructure/         # Database, entities, auth
│   ├── db/                # MikroORM config, migrations
│   ├── entities/          # Database entities
│   ├── auth/              # NextAuth.js configuration
│   └── services/          # External API services
└── modules/               # Feature modules
    ├── auth/              # Authentication & authorization
    ├── feed/              # News feed & articles
    ├── onboarding/        # User preferences setup
    └── articles/          # Article management
```

### Key Features
- ✅ **User Authentication** - Secure signup/login with email verification
- ✅ **Personalized Feed** - Customized news based on user preferences
- ✅ **Advanced Filtering** - Search, filter by source/category/author/date
- ✅ **Articles** - View articles with details
- ✅ **Infinite Scroll** - Optimized pagination
- ✅ **Responsive Design** - Mobile-first design

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- That's it! No Node.js or PostgreSQL installation needed.

### Run the Application

```bash
# 1. Start the containers (builds automatically)
docker compose up --build

# 2. (Optional) Seed the database with test data
docker compose exec app npm run seed:run
```

**That's it!** Open http://localhost:3000

### 📸 Application Screenshots

![Screenshot 1](./screenshots/1.png)

![Screenshot 2](./screenshots/2.png)

![Screenshot 3](./screenshots/3.png)

![Screenshot 4](./screenshots/4.png)

![Screenshot 5](./screenshots/5.png)

![Screenshot 6](./screenshots/6.png)

![Screenshot 7](./screenshots/7.png)

### App data flow, use cases design and UI mockups

![Data flow and use cases](./screenshots/IMG_0976.jpeg)

### What Happens Automatically
1. PostgreSQL 15 database starts
2. Application waits for database to be ready
3. **Migrations run automatically** (creates all tables)
4. Next.js development server starts
5. Hot reload is enabled for code changes

### Useful Commands

```bash
# Stop containers
docker compose down

# View logs
docker compose logs -f app

# Clean restart (removes all data)
docker compose down -v
docker compose up --build

# Run seeders manually
docker compose exec app npm run seed:run
```

## 💻 Local Development (Without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# 3. Run migrations
npm run migration:up

# 4. (Optional) Seed database
npm run seed:run

# 5. Start development server
npm run dev
```

Open http://localhost:3000

## 🔑 Environment Variables

The `.env` file is already configured with working defaults for Docker. For production or custom setup, update:

```env
# Database (Docker uses these defaults)
DATABASE_URL=postgresql://amr:Prog@mr123@db:5432/suhufdev

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# News API Keys (required for article fetching)
GUARDIAN_API_KEY=your-key
NEWSAPI_KEY=your-key
NYTIMES_API_KEY=your-key

# Email (for user verification)
RESEND_API_KEY=your-resend-key
```

## 📊 Database

### Migrations
```bash
# Create new migration
npm run migration:create

# Run migrations
npm run migration:up

# Rollback migration
npm run migration:down
```

### Seeders
```bash
# Run seeders
npm run seed:run

# Create new seeder
npm run seed:create
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - App Router, Server Components
- **TypeScript 5** - Strict mode enabled
- **React 19** - Latest features
- **TanStack Query v5** - Server state management
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible component library
- **React Hook Form** + **Zod** - Form validation

### Backend
- **Next.js API Routes** - RESTful API
- **MikroORM 6** - Type-safe ORM
- **PostgreSQL 15** - Relational database
- **NextAuth.js v5** - Authentication
- **bcrypt** - Password hashing
- **Resend** - Email service

### DevOps
- **Docker** + **Docker Compose** - Containerization
- **Node 20 Alpine** - Lightweight container
- **ESLint** - Code quality

## 📝 Project Structure Highlights

- **Type-safe entities** with MikroORM decorators
- **Explicit relationship types** for production builds
- **Migration-based schema** management
- **Feature-based modules** for scalability
- **Separation of concerns** (UI, state, services, validation)
- **Automated background sync** for news articles

## 🎯 Challenge Completion

This project successfully demonstrates:
- ✅ Modern React/TypeScript development
- ✅ Integration with 3 different external APIs
- ✅ Full Docker containerization
- ✅ Follow best practices
- ✅ Type safety and code quality
- ✅ Scalable architecture
