export type Portfolio = {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioWithImages = Portfolio & {
  images: PortfolioImage[];
};

export type PortfolioImage = {
  id: string;
  portfolioId: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
};

export type Sample = {
  id: string;
  name: string;
  brand: string;
  colorCategory: string;
  patternType: string;
  imageUrl: string;
  description: string;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiryType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin";
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityLog = {
  id: string;
  userId: string;
  userName: string;
  action: "create" | "update" | "delete" | "login" | "logout";
  resource: string;
  resourceId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
};

export type PortfolioListItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  createdAt: string;
  imageCount: number;
  viewCount: number;
};

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
