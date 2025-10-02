# Testing Checklist

## 🧪 Manual Testing Guide

### Guest User Flow
- [ ] Visit home page (`/`) - should see PublicFeed
- [ ] Check header shows "Sign In" and "Sign Up" buttons
- [ ] Verify latest news carousel works
  - [ ] Navigation arrows visible and working
  - [ ] Auto-rotation working (5 seconds)
  - [ ] Pagination dots working
- [ ] Check "Most Popular Categories" section displays
- [ ] Click on a category - should navigate to articles page with filter applied
- [ ] Check "Latest Articles" section displays
- [ ] Click on an article - should navigate to article details
- [ ] On article details:
  - [ ] Header still shows guest buttons
  - [ ] Article image displays (or hides gracefully if failed)
  - [ ] Title, description, source, date all display
  - [ ] Categories shown as badges
  - [ ] "Read Full Article on Site" button opens external link
  - [ ] "More News" section shows related articles
  - [ ] Back button works
  - [ ] Click related article navigates correctly

### Authenticated User Flow
- [ ] Sign up with new account
- [ ] Verify email (check console for verification link)
- [ ] Complete onboarding (select preferences)
- [ ] Home page shows PersonalizedFeed
- [ ] Header shows Refresh and Logout buttons
- [ ] Refresh button works (shows loading state)
- [ ] Navigate to `/articles` page
- [ ] Check header still shows authenticated state
- [ ] Click article to view details
- [ ] Header on article details shows authenticated state
- [ ] Logout button works (no 400 error)
- [ ] After logout, redirected to login page

### Filter System
- [ ] Navigate to `/articles` page
- [ ] Click "Filters" button
- [ ] Filter panel opens
- [ ] On mobile: panel is full-width, buttons visible
- [ ] On desktop: panel is 384px wide, positioned right
- [ ] Select multiple categories - should see MORE results (OR logic)
- [ ] Select multiple sources - should see MORE results
- [ ] Select date range - should narrow results (AND logic)
- [ ] Active filters show as chips below search
- [ ] Remove individual filter chip works
- [ ] "Clear All" button works
- [ ] "Apply Filters" button closes panel and applies filters
- [ ] URL updates with filter parameters
- [ ] Refresh page - filters persist from URL

### Responsive Design
- [ ] Test on mobile (375px width)
  - [ ] Carousel navigation buttons visible
  - [ ] Filter panel full-width
  - [ ] All buttons accessible
  - [ ] Header responsive
- [ ] Test on tablet (768px width)
  - [ ] Layout adjusts properly
  - [ ] Carousel looks good
  - [ ] Filter panel positioned correctly
- [ ] Test on desktop (1920px width)
  - [ ] All elements properly sized
  - [ ] Max-width containers working

### Error Handling
- [ ] Navigate to non-existent article (`/articles/fake-id`)
  - [ ] Should show 404 error page
  - [ ] "Go Back" and "Try Again" buttons work
- [ ] Test with failed image URLs
  - [ ] Images hide gracefully (no broken icon)
  - [ ] Muted background shows instead
- [ ] Test with no network
  - [ ] Error states display properly
  - [ ] Retry buttons work

### Performance
- [ ] Check React Query caching
  - [ ] Navigate to article, go back, navigate again - should be instant (cached)
  - [ ] Wait 5 minutes, data should refetch (stale time)
- [ ] Check infinite scroll on articles page
  - [ ] Scroll to bottom loads more articles
  - [ ] Loading skeleton shows while fetching
  - [ ] "No more articles" message when done

---

## 🔧 Technical Testing

### API Endpoints
```bash
# Test public feed
curl http://localhost:3000/api/feed/public

# Test personalized feed (requires auth)
curl http://localhost:3000/api/feed/personalized

# Test articles list
curl http://localhost:3000/api/articles

# Test articles with filters (OR logic)
curl "http://localhost:3000/api/articles?categories=cat1,cat2&sources=src1"

# Test single article
curl http://localhost:3000/api/articles/[article-id]

# Test related articles
curl "http://localhost:3000/api/articles/[article-id]/related?categories=cat1&source=src1"
```

### Database
```bash
# Check articles synced
npm run seed:run

# Verify all 3 sources working
# Should see:
# ✅ guardian: X articles fetched
# ✅ newsapi: X articles fetched  
# ✅ nytimes: X articles fetched
```

### Build
```bash
# Test production build
npm run build

# Should complete without errors
# Check for any TypeScript errors
npm run type-check
```

---

## ✅ Expected Results

### Performance Metrics
- [ ] Initial page load < 2 seconds
- [ ] Article navigation < 500ms (cached)
- [ ] Filter application < 1 second
- [ ] Image loading progressive (blur placeholder)

### Accessibility
- [ ] All buttons have proper labels
- [ ] Images have alt text
- [ ] Keyboard navigation works
- [ ] Focus states visible

### SEO
- [ ] Article pages have proper meta titles
- [ ] Article pages have descriptions
- [ ] Open Graph tags present (check with dev tools)

---

## 🐛 Known Issues (None!)

All identified bugs have been fixed:
- ✅ Auth state handling
- ✅ Image error handling
- ✅ Logout 400 error
- ✅ Responsive UI issues

---

## 📊 Test Coverage

### Unit Tests (Future)
- [ ] API route handlers
- [ ] Filter logic
- [ ] Component rendering

### Integration Tests (Future)
- [ ] Auth flow
- [ ] Article CRUD
- [ ] Filter application

### E2E Tests (Future)
- [ ] Complete user journeys
- [ ] Cross-browser testing
