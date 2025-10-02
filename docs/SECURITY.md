# Security Documentation

## Overview

Security is a top priority for Suhuf. This document outlines all security measures implemented to protect user data and prevent common web vulnerabilities.

## Security Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimal access rights for users and processes
3. **Fail Securely**: Errors don't expose sensitive information
4. **Secure by Default**: Security measures enabled out of the box
5. **Input Validation**: Never trust user input

---

## Authentication & Authorization

### Password Security

**Hashing Algorithm**: bcrypt with cost factor 12

```typescript
import bcrypt from 'bcrypt';

// Hash password
const hash = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hash);
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Validation:**
```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
```

### JWT Token Security

**Configuration:**
```typescript
{
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // Refresh every 24 hours
}
```

**Cookie Settings:**
```typescript
{
  httpOnly: true,      // Prevent XSS access
  secure: true,        // HTTPS only (production)
  sameSite: 'lax',     // CSRF protection
  path: '/',
  maxAge: 30 * 24 * 60 * 60
}
```

**Secret Key:**
- Minimum 32 characters
- Randomly generated
- Stored in environment variables
- Never committed to version control

### Email Verification

**Required Before:**
- Logging in
- Accessing protected resources
- Saving preferences

**Token Generation:**
```typescript
import crypto from 'crypto';

const token = crypto.randomBytes(32).toString('hex');
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
```

**Token Storage:**
- Hashed in database (SHA-256)
- Expires after 24 hours
- Single-use only
- Deleted after verification

### Session Management

**JWT Claims:**
```typescript
{
  sub: userId,           // Subject (user ID)
  email: userEmail,
  iat: issuedAt,        // Issued at
  exp: expiresAt,       // Expires at
  jti: tokenId          // JWT ID (for revocation)
}
```

**Session Invalidation:**
- Logout: Clear cookie
- Password change: Invalidate all tokens (future)
- Account deletion: Immediate invalidation

---

## Input Validation & Sanitization

### Validation with Zod

All user inputs are validated using Zod schemas:

```typescript
// Signup validation
const signupSchema = z.object({
  email: z.string().email().max(255),
  password: passwordSchema,
  name: z.string().max(100).optional(),
});

// Article filter validation
const filterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  source: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().max(200).optional(),
});
```

### HTML Sanitization

**Library**: DOMPurify (isomorphic-dompurify for Node.js)

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content
const clean = DOMPurify.sanitize(dirtyHTML, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
  ALLOWED_ATTR: ['href', 'target'],
});
```

**Applied To:**
- Article descriptions
- User-generated content (future comments)
- Any HTML rendered on the page

### SQL Injection Prevention

**MikroORM Parameterized Queries:**

```typescript
// ✅ Safe - Parameterized
await em.find(Article, { title: { $like: `%${search}%` } });

// ❌ Unsafe - Never do this
await em.execute(`SELECT * FROM article WHERE title LIKE '%${search}%'`);
```

**All queries use:**
- ORM methods (find, findOne, etc.)
- Query builder with parameters
- Never raw SQL with string concatenation

---

## Cross-Site Scripting (XSS) Prevention

### React Built-in Protection

React automatically escapes values in JSX:

```tsx
// ✅ Safe - React escapes automatically
<div>{userInput}</div>

// ❌ Unsafe - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Content Security Policy (CSP)

```typescript
// next.config.js
headers: [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.theguardian.com https://newsapi.org",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]
```

### Output Encoding

- All user input is encoded before rendering
- Use React's JSX (automatic encoding)
- Sanitize HTML with DOMPurify
- Encode URLs with `encodeURIComponent()`

---

## Cross-Site Request Forgery (CSRF) Protection

### Auth.js CSRF Tokens

Auth.js automatically provides CSRF protection:

```typescript
// Automatic CSRF token in forms
<form method="post" action="/api/auth/signin">
  <input type="hidden" name="csrfToken" value={csrfToken} />
  {/* ... */}
</form>
```

### SameSite Cookies

```typescript
{
  sameSite: 'lax', // Prevents CSRF attacks
}
```

### Double Submit Cookie Pattern

For API routes:

```typescript
// Verify CSRF token
const csrfToken = req.cookies['csrf-token'];
const headerToken = req.headers['x-csrf-token'];

if (csrfToken !== headerToken) {
  return res.status(403).json({ error: 'CSRF token mismatch' });
}
```

---

## Rate Limiting

### Implementation

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 attempts
  skipSuccessfulRequests: true,
});
```

### Rate Limit Tiers

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 15 min |
| Auth (login/signup) | 5 requests | 15 min |
| Email verification | 3 requests | 15 min |
| Authenticated users | 1000 requests | 15 min |

### IP-based Tracking

```typescript
// Get real IP (behind proxy)
const getClientIp = (req: Request) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress
  );
};
```

---

## Security Headers

### Helmet.js Configuration

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.theguardian.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
}));
```

### Next.js Headers

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ],
    },
  ];
}
```

---

## Data Protection

### Sensitive Data Handling

**Never Log:**
- Passwords (plain or hashed)
- JWT tokens
- API keys
- Email verification tokens

**Encrypted Storage:**
- Passwords: bcrypt hash
- Tokens: SHA-256 hash
- API keys: Environment variables

### Database Security

**Connection Security:**
```typescript
{
  ssl: process.env.NODE_ENV === 'production',
  password: process.env.DATABASE_PASSWORD,
  // Never hardcode credentials
}
```

**Principle of Least Privilege:**
- Application user: SELECT, INSERT, UPDATE, DELETE only
- No DROP, CREATE, ALTER permissions
- Read-only user for analytics (future)

### Environment Variables

**Required Security:**
```bash
# .env (never commit)
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<32+ random chars>
JWT_SECRET=<32+ random chars>
GUARDIAN_API_KEY=...
NEWSAPI_KEY=...
NYTIMES_API_KEY=...
```

**Validation:**
```typescript
// Validate on startup
if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
  throw new Error('NEXTAUTH_SECRET must be at least 32 characters');
}
```

---

## API Security

### Authentication Middleware

```typescript
export async function requireAuth(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  
  return session.user;
}
```

### Input Validation Middleware

```typescript
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (req: Request) => {
    try {
      const data = await req.json();
      return schema.parse(data);
    } catch (error) {
      throw new Error('Validation failed');
    }
  };
}
```

### Error Handling

```typescript
// Never expose internal errors
try {
  // ... operation
} catch (error) {
  console.error('Internal error:', error); // Log for debugging
  return NextResponse.json(
    { error: 'An error occurred' }, // Generic message
    { status: 500 }
  );
}
```

---

## Bot Protection

### reCAPTCHA v3 (Future)

```typescript
// On signup/login forms
const token = await grecaptcha.execute(SITE_KEY, { action: 'submit' });

// Verify on server
const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'POST',
  body: JSON.stringify({
    secret: RECAPTCHA_SECRET,
    response: token,
  }),
});
```

### Honeypot Fields

```tsx
// Hidden field to catch bots
<input
  type="text"
  name="website"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>
```

```typescript
// Reject if filled
if (formData.website) {
  return NextResponse.json({ error: 'Bot detected' }, { status: 400 });
}
```

---

## Logging & Monitoring

### Security Event Logging

**Log Events:**
- Failed login attempts
- Account creation
- Password changes
- Email verification
- Rate limit violations
- Suspicious activity

**Log Format:**
```typescript
{
  timestamp: '2024-01-15T10:30:00Z',
  level: 'warn',
  event: 'failed_login',
  ip: '192.168.1.1',
  email: 'user@example.com',
  userAgent: 'Mozilla/5.0...',
}
```

### Monitoring Alerts

**Alert On:**
- Multiple failed login attempts (5+ in 5 min)
- Unusual API usage patterns
- Database connection failures
- High error rates
- Disk space low

---

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Automated Scanning

- **Dependabot**: Automatic PR for dependency updates
- **Snyk**: Continuous vulnerability scanning
- **npm audit**: Pre-commit hook

### Pinned Versions

```json
{
  "dependencies": {
    "next": "14.0.4",  // Exact version
    "react": "^18.2.0" // Allow patch updates
  }
}
```

---

## Deployment Security

### Docker Security

**Non-root User:**
```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

**Minimal Base Image:**
```dockerfile
FROM node:18-alpine AS base
```

**No Secrets in Image:**
```dockerfile
# ❌ Never do this
ENV DATABASE_PASSWORD=secret

# ✅ Use runtime environment
ENV DATABASE_PASSWORD=${DATABASE_PASSWORD}
```

### HTTPS/SSL

**Let's Encrypt:**
```bash
certbot certonly --nginx -d yourdomain.com
```

**Nginx Configuration:**
```nginx
server {
  listen 443 ssl http2;
  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
}
```

### Firewall Rules

```bash
# Allow only necessary ports
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

---

## Incident Response

### Security Breach Protocol

1. **Detect**: Monitor logs and alerts
2. **Contain**: Isolate affected systems
3. **Investigate**: Determine scope and impact
4. **Remediate**: Fix vulnerabilities
5. **Notify**: Inform affected users (if required)
6. **Review**: Post-mortem and improvements

### Backup & Recovery

**Daily Backups:**
```bash
# Database backup
pg_dump -U postgres suhuf > backup_$(date +%Y%m%d).sql

# Encrypt backup
gpg --encrypt backup_$(date +%Y%m%d).sql
```

**Retention:**
- Daily: 7 days
- Weekly: 4 weeks
- Monthly: 12 months

---

## Security Checklist

### Pre-deployment

- [ ] All environment variables configured
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] Security headers configured
- [ ] Error messages don't expose internals
- [ ] Logging configured
- [ ] Backups scheduled

### Regular Maintenance

- [ ] Update dependencies monthly
- [ ] Review security logs weekly
- [ ] Test backups monthly
- [ ] Rotate secrets quarterly
- [ ] Security audit annually

---

## Compliance

### GDPR Considerations

- User data minimization
- Right to access (export data)
- Right to deletion (delete account)
- Data breach notification (72 hours)
- Privacy policy and terms of service

### Data Retention

- User accounts: Indefinite (until deletion request)
- Articles: 90 days
- Logs: 30 days
- Backups: 12 months

---

## Conclusion

This security implementation provides comprehensive protection against common web vulnerabilities while maintaining usability. Regular security audits and updates are essential to maintain security posture.
