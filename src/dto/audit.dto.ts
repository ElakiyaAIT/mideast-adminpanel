// Audit Log DTOs

// ============================================
// ENUMS
// ============================================

export const AuditActionType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  CANCEL: 'cancel',
  VERIFY: 'verify',
  SUSPEND: 'suspend',
  BLOCK: 'block',
  RESTORE: 'restore',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REFUND: 'refund',
  PAYOUT: 'payout',
} as const;
export type AuditAction = (typeof AuditActionType)[keyof typeof AuditActionType];

// ============================================
// AUDIT LOG DTOs
// ============================================

export interface AuditLogDto {
  _id: string;
  adminId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  action: AuditAction;
  targetType: string;
  targetId?: string;
  targetName?: string;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: AuditAction;
  targetType?: string;
  startDate?: string;
  endDate?: string;
}
