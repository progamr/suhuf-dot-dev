# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then update the following **required** values in `.env`:

```env
# Database (use your existing PostgreSQL)
DATABASE_URL=postgresql://amr:Prog@mr123@localhost:5432/suhuf_dev

# Authentication (REQUIRED - generate a secret)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars-long-please-change-this

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Get free API key from resend.com)
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this Node.js command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as your `NEXTAUTH_SECRET` in `.env`

### 4. Run Migrations

```bash
npm run migration:up
```

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000/signup

## Optional: Get API Keys

### Resend (Email - FREE)
1. Go to https://resend.com
2. Sign up (no credit card)
3. Get API key from dashboard
4. Add to `.env`: `RESEND_API_KEY=re_xxxxx`

### News APIs (Optional - for later)
- Guardian: https://open-platform.theguardian.com/access/
- NewsAPI: https://newsapi.org/register
- NY Times: https://developer.nytimes.com/get-started

## Troubleshooting

### "Failed to execute 'json' on 'Response'"
- Make sure `.env` file exists
- Make sure `NEXTAUTH_SECRET` is set (min 32 characters)
- Make sure `NEXTAUTH_URL=http://localhost:3000`

### "No entities were discovered"
- Already fixed! Entities are explicitly imported in config

### Database connection errors
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `.env` matches your credentials
