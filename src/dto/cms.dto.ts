// CMS Management DTOs (Banners & Static Pages)

// ============================================
// BANNER ENUMS
// ============================================

export const BannerPositionType = {
  HOME_HERO: 'home_hero',
  HOME_SECONDARY: 'home_secondary',
  CATEGORY_TOP: 'category_top',
  SIDEBAR: 'sidebar',
  FOOTER: 'footer',
} as const;

export type BannerPosition = (typeof BannerPositionType)[keyof typeof BannerPositionType];

export const BannerStatusType = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SCHEDULED: 'scheduled',
  EXPIRED: 'expired',
} as const;

export type BannerStatus = (typeof BannerStatusType)[keyof typeof BannerStatusType];

// ============================================
// BANNER DTOs
// ============================================

export interface BannerDto {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string | null;
  position: BannerPosition;
  status: BannerStatus;
  startDate?: string;
  endDate?: string;
  sortOrder: number;
  clickCount: number;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateBannerDto {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string | null;
  position: BannerPosition;
  status?: BannerStatus;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
}

export interface UpdateBannerDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string | null;
  position?: BannerPosition;
  status?: BannerStatus;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
}

// ============================================
// STATIC PAGE DTOs
// ============================================

export interface StaticPageDto {
  _id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateStaticPageDto {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isPublished?: boolean;
}

export interface UpdateStaticPageDto {
  title?: string;
  slug?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isPublished?: boolean;
}
