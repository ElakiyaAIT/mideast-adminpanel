export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  USERS: '/users',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  // Equipment routes
  EQUIPMENT_CATEGORIES: '/equipment/categories',
  EQUIPMENT: '/equipment',
  EQUIPMENT_APPROVALS: '/equipment/approvals',
  // Auction routes
  AUCTIONS: '/auctions',
  // Order routes
  ORDERS: '/orders',
  // Payment & Payout routes
  PAYMENTS: '/payments',
  PAYOUTS: '/payouts',
  // CMS routes
  BANNERS: '/cms/banners',
  STATIC_PAGES: '/cms/pages',
  // Notification routes
  NOTIFICATIONS: '/notifications',
  // System routes
  SYSTEM_SETTINGS: '/system/settings',
  AUDIT_LOGS: '/system/audit-logs',
  //Testimonial routes
  TESTIMONIAL: '/testimonials',
  // Public routes
  BUY: '/buy',
  SELL: '/sell',
  ABOUT_US: '/about-us',
  CONTACT_US: '/contact-us',
} as const;

export const STORAGE_KEYS = {
  THEME: 'app_theme',
  USER: 'app_user',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
