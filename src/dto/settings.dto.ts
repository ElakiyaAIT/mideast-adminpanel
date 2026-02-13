// System Settings DTOs

// ============================================
// SETTINGS DTOs
// ============================================

export interface SystemSettingDto {
  _id: string;
  key: string;
  value: string;
  category: SettingCategory;
  description?: string;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface UpdateSystemSettingDto {
  value: string;
}

export interface SystemSettingsQueryParams {
  category?: string;
  page: number;
  limit: number;
}

// ============================================
// COMMON SETTING CATEGORIES
// ============================================

export const SettingCategoryType = {
  GENERAL: 'general',
  COMMISSION: 'commission',
  AUCTION: 'auction',
  PAYMENT: 'payment',
  EMAIL: 'email',
  SEO: 'seo',
  MAINTENANCE: 'maintenance',
} as const;

export type SettingCategory = (typeof SettingCategoryType)[keyof typeof SettingCategoryType];

// ============================================
// TYPED SETTINGS (for type safety)
// ============================================

export interface CommissionSettings {
  fixedFee: number;
  percentage: number;
  minCommission: number;
  maxCommission: number;
}

export interface AuctionSettings {
  defaultDuration: number;
  bidIncrement: number;
  extendTimeOnLastMinuteBid: boolean;
  extensionMinutes: number;
}

export interface MaintenanceSettings {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  allowedIps: string[];
}
