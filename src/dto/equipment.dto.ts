// Equipment Management DTOs

// ============================================
// ENUMS
// ============================================

export const EquipmentStatusType = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  SOLD: 'sold',
  ARCHIVED: 'archived',
} as const;

export const ListingTypeType = {
  BUY_NOW: 'buy_now',
  AUCTION: 'auction',
  BOTH: 'both',
} as const;

export const ConditionType = {
  NEW: 'new',
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;

export type EquipmentStatus = (typeof EquipmentStatusType)[keyof typeof EquipmentStatusType];
export type ListingType = (typeof ListingTypeType)[keyof typeof ListingTypeType];
export type Condition = (typeof ConditionType)[keyof typeof ConditionType];

// ============================================
// EQUIPMENT CATEGORY DTOs
// ============================================

export interface EquipmentCategoryDto {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  description: string;
  imageUrl?: string;
  attributeTemplate?: Record<string, unknown>;
  isActive: boolean;
  sortOrder: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentCategoryDto {
  name: string;
  slug: string;
  parentId?: string;
  description: string;
  imageUrl?: string | null;
  attributeTemplate?: Record<string, unknown>;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateEquipmentCategoryDto {
  name?: string;
  slug?: string;
  parentId?: string;
  description?: string;
  imageUrl?: string | null;
  attributeTemplate?: Record<string, unknown>;
  isActive?: boolean;
  sortOrder?: number;
}

export interface EquipmentCategoryQueryParams {
  page?: number;
  limit?: number;
  parentId?: string;
  isActive?: boolean;
  search?: string;
}

// ============================================
// EQUIPMENT DTOs
// ============================================

export interface LocationDto {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DocumentDto {
  name: string;
  url: string;
}

export interface EquipmentDto {
  _id: string;
  title: string;
  description: string;
  categoryId?: EquipmentCategoryDto;
  sellerId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  listingType: ListingType;
  status: EquipmentStatus;
  buyNowPrice?: number;
  reservePrice?: number;
  make: string;
  models: string;
  year: number;
  serialNumber?: string;
  hoursUsed?: number;
  condition?: string;
  attributes?: Record<string, unknown>;
  location: LocationDto;
  images?: string[];
  videos?: string[];
  documents?: DocumentDto[];
  viewCount: number;
  inquiryCount: number;
  isFeatured: boolean;
  isPublished: boolean;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateEquipmentDto {
  title: string;
  description: string;
  categoryId: string;
  sellerId: string;
  listingType: ListingType;
  buyNowPrice?: number;
  reservePrice?: number;
  make: string;
  models: string;
  year: number;
  serialNumber?: string;
  hoursUsed?: number;
  condition?: string;
  attributes?: Record<string, unknown>;
  location: LocationDto;
  images?: string[];
  videos?: string[];
  documents?: DocumentDto[];
}

export interface UpdateEquipmentDto {
  title?: string;
  description?: string;
  categoryId?: string;
  listingType?: ListingType;
  buyNowPrice?: number;
  reservePrice?: number;
  make?: string;
  models?: string;
  year?: number;
  serialNumber?: string;
  hoursUsed?: number;
  condition?: string;
  attributes?: Record<string, unknown>;
  location?: LocationDto;
  images?: string[];
  videos?: string[];
  documents?: DocumentDto[];
}

export interface ApproveEquipmentDto {
  isPublished: boolean;
  isFeatured?: boolean;
}

export interface RejectEquipmentDto {
  rejectionReason: string;
}

export interface BulkApproveDto {
  equipmentIds: string[];
  isPublished: boolean;
  isFeatured?: boolean;
}

export interface FilterEquipmentDto {
  page?: number;
  limit?: number;
  status?: EquipmentStatus;
  categoryId?: string;
  sellerId?: string;
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  make?: string;
  model?: string;
  year?: number;
  search?: string;
}

export interface PaginatedResponseDto<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
