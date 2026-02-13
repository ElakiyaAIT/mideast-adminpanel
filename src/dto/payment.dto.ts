// Payment & Payout Management DTOs

// ============================================
// PAYMENT ENUMS
// ============================================

export const PaymentStatusType = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export type PaymentStatus = (typeof PaymentStatusType)[keyof typeof PaymentStatusType];

export const PaymentMethodType = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
} as const;

export type PaymentMethod = (typeof PaymentMethodType)[keyof typeof PaymentMethodType];

// ============================================
// PAYMENT DTOs
// ============================================

export interface PaymentDto {
  _id: string;
  orderId: string;
  order?: {
    _id: string;
    orderNumber: string;
    type: string;
  };
  buyerId: string;
  buyer?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  externalPaymentId?: string;
  refundedAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RefundPaymentDto {
  reason: string;
  amount?: number;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  orderId?: string;
  buyerId?: string;
  search?: string;
}

// ============================================
// PAYOUT ENUMS
// ============================================

export const PayoutStatusType = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ON_HOLD: 'on_hold',
} as const;

export type PayoutStatus = (typeof PayoutStatusType)[keyof typeof PayoutStatusType];

// ============================================
// PAYOUT DTOs
// ============================================

export interface PayoutDto {
  _id: string;
  orderId: string;
  order?: {
    _id: string;
    orderNumber: string;
    type: string;
  };
  sellerId: string;
  seller?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: PayoutStatus;
  paymentMethod?: string;
  accountDetails?: Record<string, unknown>;
  transactionId?: string;
  externalPayoutId?: string;
  holdReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  completedAt?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovePayoutDto {
  notes?: string;
}

export interface HoldPayoutDto {
  holdReason: string;
}

export interface PayoutQueryParams {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
  sellerId?: string;
  search?: string;
}
