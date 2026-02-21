import * as yup from 'yup';
import {
  BannerPositionType,
  BannerStatusType,
  ConditionType,
  OrderStatusType,
  type BannerPosition,
  type BannerStatus,
  type Condition,
  type OrderStatus,
} from '../dto';

// ===========================
// REUSABLE VALIDATION RULES
// ===========================

// Password validation regex: at least one uppercase, one lowercase, one number, one special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;

// URL validation regex
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Non-negative number validation
const nonNegativeNumber = yup.number().typeError('Must be a number').min(0, 'Cannot be negative');

// Year validation
const yearValidation = yup
  .number()
  .typeError('Must be a valid year')
  .integer('Must be a whole number')
  .min(1900, 'Year cannot be before 1900')
  .max(new Date().getFullYear() + 10, `Year cannot be more than ${new Date().getFullYear() + 10}`);

// Email validation
export const emailSchema = yup
  .string()
  .required('Email is required')
  .email('Please enter a valid email address')
  .trim();

// Password validation
export const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(
    passwordRegex,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  );

// URL validation
export const urlSchema = yup.string().matches(urlRegex, 'Please enter a valid URL').trim();

// Optional URL validation
export const optionalUrlSchema = yup
  .string()
  .transform((v) => (v === '' ? undefined : v))
  .matches(urlRegex, 'Please enter a valid URL')
  .optional()
  .trim();

// ===========================
// AUTH FORMS
// ===========================

// Login form schema
export const loginSchema = yup.object({
  email: emailSchema,
  password: yup.string().required('Password is required'),
});

// Register form schema
export const registerSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim(),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim(),
});

// Forgot password schema
export const forgotPasswordSchema = yup.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = yup.object({
  token: yup.string().required('Reset token is required'),
  newPassword: passwordSchema,
});

// ===========================
// USER MANAGEMENT
// ===========================

export interface UpdateProfileFormData {
  email: string;
  firstName?: string;
  lastName?: string;
}

// Update profile schema
export const updateProfileSchema: yup.ObjectSchema<UpdateProfileFormData> = yup.object({
  email: emailSchema,
  firstName: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .optional()
    .trim(),
  lastName: yup
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .optional()
    .trim(),
});

// Create user schema (Admin)
export const createUserSchema = yup.object({
  email: emailSchema,
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim(),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim(),
  roleId: yup.string().required('Role is required'),
  isActive: yup.boolean().default(true),
});

// Edit user schema (Admin)
export const editUserSchema = yup.object({
  email: emailSchema,
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim(),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim(),
  roleId: yup.string().required('Role is required'),
  isActive: yup.boolean().default(true).required(),
});

// ===========================
// AUCTION FORMS
// ===========================

export const auctionSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
  type: yup
    .string()
    .required('Auction type is required')
    .oneOf(['timed', 'live', 'sealed'], 'Invalid auction type'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .required('End date is required')
    .test('is-after-start', 'End date must be after start date', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }),
  address: yup.string().max(200, 'Address must not exceed 200 characters').trim(),
  city: yup.string().max(100, 'City must not exceed 100 characters').trim(),
  state: yup.string().max(50, 'State must not exceed 50 characters').trim(),
  proxibidId: yup.string().max(100, 'Proxibid ID must not exceed 100 characters').trim(),
  equipmentfactsId: yup
    .string()
    .max(100, 'EquipmentFacts ID must not exceed 100 characters')
    .trim(),
});

// ===========================
// EQUIPMENT FORMS
// ===========================

export const equipmentSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters')
    .trim(),
  categoryId: yup.string().required('Category is required'),
  sellerId: yup.string().required('Seller is required'),
  listingType: yup
    .string()
    .required('Listing type is required')
    .oneOf(['buy_now', 'auction', 'both'], 'Invalid listing type'),
  buyNowPrice: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .positive('Buy now price must be positive')
    .optional()
    .typeError('Must be a valid number'),
  reservePrice: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .positive('Reserve price must be positive')
    .optional()
    .typeError('Must be a valid number'),
  make: yup
    .string()
    .required('Make is required')
    .min(2, 'Make must be at least 2 characters')
    .max(100, 'Make must not exceed 100 characters')
    .trim(),
  models: yup
    .string()
    .required('Model is required')
    .min(1, 'Model must be at least 1 character')
    .max(100, 'Model must not exceed 100 characters')
    .trim(),
  year: yearValidation.required('Year is required'),
  serialNumber: yup.string().max(100, 'Serial number must not exceed 100 characters').trim(),
  hoursUsed: nonNegativeNumber.optional(),
  condition: yup
    .mixed<Condition>()
    .oneOf(Object.values(ConditionType), 'Invalid condition')
    .required('Condition is required')
    .transform((v) => (v === '' ? undefined : v)),
  location: yup.object({
    address: yup
      .string()
      .required('Address is required')
      .max(200, 'Address must not exceed 200 characters')
      .trim(),
    city: yup
      .string()
      .required('City is required')
      .max(100, 'City must not exceed 100 characters')
      .trim(),
    state: yup
      .string()
      .required('State is required')
      .max(50, 'State must not exceed 50 characters')
      .trim(),
    zipCode: yup
      .string()
      .required('ZIP code is required')
      .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
      .trim(),
    country: yup.string().required('Country is required').max(100).trim(),
  }),
  images: yup
    .array()
    .of(yup.string().url('Each image must be a valid URL'))
    .max(10, 'Maximum 10 images allowed')
    .optional(),
});

// ===========================
// BANNER FORMS
// ===========================

export const bannerSchema = yup.object({
  title: yup.string().required(),

  imageUrl: yup.string().nullable(),

  linkUrl: yup
    .string()
    .nullable()
    .notRequired()
    .transform((v) => (v === '' ? null : v)),

  position: yup.mixed<BannerPosition>().oneOf(Object.values(BannerPositionType)).required(),
  status: yup.mixed<BannerStatus>().oneOf(Object.values(BannerStatusType)).required(),
  sortOrder: yup.number().required().min(1),
});

// ===========================
// CATEGORY FORMS
// ===========================

// Create category schema (includes slug)
export const createCategorySchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  slug: yup
    .string()
    .required('Slug is required')
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
    .trim(),
  description: yup
    .string()
    .required('Description is required')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  isActive: yup.boolean().default(true),
});

// Edit category schema (slug not required for editing)
export const editCategorySchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  description: yup.string().max(500, 'Description must not exceed 500 characters').trim(),
  isActive: yup.boolean().default(true).required(),
});

// Legacy export for backward compatibility
export const categorySchema = createCategorySchema;

// ===========================
// STATIC PAGE FORMS
// ===========================

export const staticPageSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),

  slug: yup
    .string()
    .trim()
    .required('Slug is required')
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must not exceed 100 characters')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),

  content: yup
    .string()
    .trim()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),

  metaTitle: yup.string().trim().max(100, 'Meta title must not exceed 100 characters'),

  metaDescription: yup.string().trim().max(200, 'Meta description must not exceed 200 characters'),

  metaKeywords: yup.array().of(yup.string().trim()),

  isPublished: yup.boolean().default(false),
});
// ===========================
// NOTIFICATION FORMS
// ===========================

export const notificationSchema = yup.object({
  type: yup
    .string()
    .required('Type is required')
    .oneOf(['info', 'warning', 'error', 'success'], 'Invalid notification type'),
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must not exceed 500 characters')
    .trim(),
  userIds: yup
    .array()
    .of(yup.string().required())
    .min(1, 'At least one user must be selected')
    .required('Users are required'),
});

// ===========================
// SYSTEM SETTINGS FORMS
// ===========================

export const systemSettingSchema = yup.object({
  value: yup
    .string()
    .required('Value is required')
    .min(1, 'Value cannot be empty')
    .max(1000, 'Value must not exceed 1000 characters')
    .trim(),
});

// ===========================
// ORDER FORMS
// ===========================

export const orderUpdateSchema = yup.object({
  status: yup
    .mixed<OrderStatus>()
    .oneOf(Object.values(OrderStatusType), 'Invalid order status')
    .required('Status is required'),

  trackingNumber: yup
    .string()
    .max(100, 'Tracking number must not exceed 100 characters')
    .trim()
    .notRequired(),

  adminNotes: yup
    .string()
    .max(1000, 'Admin notes must not exceed 1000 characters')
    .trim()
    .notRequired(),
});

// ===========================
// PAYMENT FORMS
// ===========================

export const refundSchema = yup.object({
  reason: yup
    .string()
    .required('Refund reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters')
    .trim(),
  amount: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .positive('Refund amount must be positive')
    .optional()
    .typeError('Must be a valid number'),
});

export const testimonialSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Client name is required'),

  role: yup
    .string()
    .trim()
    .min(2, 'Role must be at least 2 characters')
    .max(100, 'Role cannot exceed 100 characters')
    .required('Role is required'),

  review: yup
    .string()
    .trim()
    .min(10, 'Testimonial Message must be at least 10 characters')
    .required('Testimonial Message is required'),
});

// ===========================
// TYPE EXPORTS
// ===========================

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
export type CreateUserFormData = yup.InferType<typeof createUserSchema>;
export type EditUserFormData = yup.InferType<typeof editUserSchema>;
export type AuctionFormData = yup.InferType<typeof auctionSchema>;
export type EquipmentFormData = yup.InferType<typeof equipmentSchema>;
export type BannerFormData = yup.InferType<typeof bannerSchema>;
export type CategoryFormData = yup.InferType<typeof categorySchema>;
export type CreateCategoryFormData = yup.InferType<typeof createCategorySchema>;
export type EditCategoryFormData = yup.InferType<typeof editCategorySchema>;
export type StaticPageFormData = yup.InferType<typeof staticPageSchema>;
export type NotificationFormData = yup.InferType<typeof notificationSchema>;
export type SystemSettingFormData = yup.InferType<typeof systemSettingSchema>;
export type OrderUpdateFormData = yup.InferType<typeof orderUpdateSchema>;
export type RefundFormData = yup.InferType<typeof refundSchema>;
export type TestimonialFormData = yup.InferType<typeof testimonialSchema>;
