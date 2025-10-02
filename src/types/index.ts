// Common types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Article types
export interface ArticleFilters {
  category?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: 'latest' | 'popular';
}

export interface ArticleWithRelations {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  viewCount: number;
  source: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  author?: {
    id: string;
    name: string;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  isFavorite?: boolean;
}

// Auth types
export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  emailVerified?: Date;
}

// User preference types
export interface UserPreferenceData {
  theme: 'light' | 'dark' | 'system';
  preferredSourceIds: string[];
  preferredCategoryIds: string[];
  preferredAuthorIds: string[];
}
