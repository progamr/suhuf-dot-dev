# Quick Start Guide

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Setup environment:**

```bash
cp .env.example .env
```

Edit `.env` and add your configuration (at minimum, set DATABASE_URL and NEXTAUTH_SECRET).

3. **Setup database:**

```bash
# Create PostgreSQL database
createdb suhuf_dev

# Run migrations (after we create them)
npm run migration:up
```

4. **Start development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What's Next?

The project structure is ready. Next steps:

1. ✅ Documentation complete
2. ✅ Next.js 15 + TypeScript initialized
3. ✅ Tailwind CSS + shadcn/ui configured
4. ⏳ MikroORM entities (in progress)
5. ⏳ Auth.js configuration
6. ⏳ API routes
7. ⏳ UI components
8. ⏳ Features implementation

## Project Structure

```
suhuf-dev/
├── src/
│   ├── app/              # Next.js App Router
│   ├── modules/          # Feature modules (auth, news, user)
│   ├── lib/              # Shared libraries
│   ├── entities/         # MikroORM entities
│   └── types/            # TypeScript types
├── docs/                 # Complete documentation
├── scripts/              # Utility scripts
└── docker/               # Docker configuration
```

## Key Features

- **Mobile-First Design**: Responsive, modern UI
- **TypeScript**: Full type safety
- **Latest Packages**: Next.js 15, React 18, TanStack Query v5
- **Security**: Rate limiting, CSRF, XSS protection
- **Performance**: Infinite scroll, virtualization, optimized images

## Documentation

- [README.md](README.md) - Project overview
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/DATABASE.md](docs/DATABASE.md) - Database schema
- [docs/API_DESIGN.md](docs/API_DESIGN.md) - API endpoints
- [docs/SECURITY.md](docs/SECURITY.md) - Security measures
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment guide
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Development guide
