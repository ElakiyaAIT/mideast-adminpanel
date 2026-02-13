// Order Management DTOs

// ============================================
// ENUMS
// ============================================

export const OrderStatusType = {
  PENDING: 'pending',
  PAYMENT_PENDING: 'payment_pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = (typeof OrderStatusType)[keyof typeof OrderStatusType];

export const OrderTypeType = {
  BUY_NOW: 'buy_now',
  AUCTION_WIN: 'auction_win',
} as const;

export type OrderType = (typeof OrderTypeType)[keyof typeof OrderTypeType];

// ============================================
// ORDER DTOs
// ============================================

export interface OrderDto {
  _id: string;
  orderNumber: string;
  type: OrderType;
  equipmentId: string;
  equipment?: {
    _id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    images?: string[];
  };
  buyerId: string;
  buyer?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  sellerId: string;
  seller?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  auctionId?: string;
  status: OrderStatus;
  price: number;
  commission: number;
  totalAmount: number;
  trackingNumber?: string;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  adminNotes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  trackingNumber?: string;
  adminNotes?: string;
}

export interface CancelOrderDto {
  reason: string;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  buyerId?: string;
  sellerId?: string;
  type?: OrderType;
  search?: string;
}
