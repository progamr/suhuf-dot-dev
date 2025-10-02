export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const ENDPOINTS = {
  // Feed endpoints
  FEED_PERSONALIZED: '/api/feed/personalized',
  FEED_PUBLIC: '/api/feed/public',
  
  // Article endpoints
  ARTICLES: '/api/articles',
  ARTICLE_BY_ID: (id: string) => `/api/articles/${id}`,
  ARTICLE_RELATED: (id: string) => `/api/articles/${id}/related`,
  
  // Auth endpoints
  AUTH_LOGIN: '/api/auth/signin',
  AUTH_LOGOUT: '/api/auth/signout',
  AUTH_SIGNUP: '/api/auth/signup',
  
  // Onboarding endpoints
  SOURCES: '/api/sources',
  CATEGORIES: '/api/categories',
  AUTHORS: '/api/authors',
  USER_PREFERENCES: '/api/user/preferences',
  USER_ONBOARDING_STATUS: '/api/user/onboarding-status',
  
  // Articles endpoints
  ARTICLES_FILTER_OPTIONS: '/api/articles/filter-options',
} as const;
