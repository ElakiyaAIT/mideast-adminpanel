// Notification Management DTOs

// ============================================
// ENUMS
// ============================================

export const NotificationTypeType = {
  EMAIL: 'email',
  IN_APP: 'in_app',
  SMS: 'sms',
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
  subject?:string;
}

export interface SendNotificationDto {
  userId?: string;
  recipientIds?: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  subject: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  status?: NotificationStatus;
  type?: NotificationType;
  userId?: string;
}
