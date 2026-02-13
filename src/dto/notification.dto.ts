// Notification Management DTOs

// ============================================
// ENUMS
// ============================================

export const NotificationTypeType = {
  SYSTEM: 'system',
  EQUIPMENT_APPROVED: 'equipment_approved',
  EQUIPMENT_REJECTED: 'equipment_rejected',
  BID_PLACED: 'bid_placed',
  BID_OUTBID: 'bid_outbid',
  AUCTION_ENDING: 'auction_ending',
  AUCTION_WON: 'auction_won',
  ORDER_PLACED: 'order_placed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  PAYMENT_RECEIVED: 'payment_received',
  PAYOUT_PROCESSED: 'payout_processed',
  ACCOUNT_VERIFIED: 'account_verified',
  ACCOUNT_SUSPENDED: 'account_suspended',
} as const;

export const NotificationStatusType = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
} as const;

export type NotificationStatus =
  (typeof NotificationStatusType)[keyof typeof NotificationStatusType];
export type NotificationType = (typeof NotificationTypeType)[keyof typeof NotificationTypeType];

// ============================================
// NOTIFICATION DTOs
// ============================================

export interface NotificationDto {
  _id: string;
  userId: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  status: NotificationStatus;
  sentAt?: string;
  failureReason?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface SendNotificationDto {
  userId?: string;
  userIds?: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  status?: NotificationStatus;
  type?: NotificationType;
  userId?: string;
}
