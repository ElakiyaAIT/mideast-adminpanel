/**
 * API Exports Verification Test
 *
 * This test verifies that all API modules and DTOs are properly exported
 * and can be imported without errors.
 */

import { describe, it, expect } from 'vitest';

describe('API Exports', () => {
  it('should export all API modules', async () => {
    const apiModules = await import('../api');

    // Equipment API
    expect(apiModules.equipmentApi).toBeDefined();
    expect(apiModules.equipmentCategoryApi).toBeDefined();

    // Auction API
    expect(apiModules.auctionApi).toBeDefined();

    // Order API
    expect(apiModules.orderApi).toBeDefined();

    // Payment API
    expect(apiModules.paymentApi).toBeDefined();
    expect(apiModules.payoutApi).toBeDefined();

    // Reports API
    expect(apiModules.reportsApi).toBeDefined();

    // CMS API
    expect(apiModules.bannerApi).toBeDefined();
    expect(apiModules.staticPageApi).toBeDefined();

    // Notification API
    expect(apiModules.notificationApi).toBeDefined();

    // Settings API
    expect(apiModules.settingsApi).toBeDefined();

    // Audit API
    expect(apiModules.auditApi).toBeDefined();

    // Existing APIs
    expect(apiModules.dashboardApi).toBeDefined();
    expect(apiModules.userApi).toBeDefined();
    expect(apiModules.axiosInstance).toBeDefined();
  });

  it('should export all DTO constants', async () => {
    const dtoModules = await import('../dto');

    // Equipment DTOs
    expect(dtoModules.EquipmentStatusType).toBeDefined();
    expect(dtoModules.ListingTypeType).toBeDefined();

    // Auction DTOs
    expect(dtoModules.AuctionStatusType).toBeDefined();
    expect(dtoModules.AuctionTypeType).toBeDefined();
    expect(dtoModules.BidStatusType).toBeDefined();

    // Order DTOs
    expect(dtoModules.OrderStatusType).toBeDefined();
    expect(dtoModules.OrderTypeType).toBeDefined();

    // Payment DTOs
    expect(dtoModules.PaymentStatusType).toBeDefined();
    expect(dtoModules.PaymentMethodType).toBeDefined();
    expect(dtoModules.PayoutStatusType).toBeDefined();

    // CMS DTOs
    expect(dtoModules.BannerPositionType).toBeDefined();
    expect(dtoModules.BannerStatusType).toBeDefined();

    // Notification DTOs
    expect(dtoModules.NotificationTypeType).toBeDefined();
    expect(dtoModules.NotificationStatusType).toBeDefined();

    // Settings DTOs
    expect(dtoModules.SettingCategoryType).toBeDefined();

    // Audit DTOs
    expect(dtoModules.AuditActionType).toBeDefined();
  });

  it('should export TypeScript type definitions', () => {
    // This test validates that type exports compile correctly
    // TypeScript will fail to compile if these types are not exported
    const typeValidation: {
      EquipmentStatus?: import('../dto').EquipmentStatus;
      ListingType?: import('../dto').ListingType;
      AuctionStatus?: import('../dto').AuctionStatus;
      AuctionType?: import('../dto').AuctionType;
      BidStatus?: import('../dto').BidStatus;
      OrderStatus?: import('../dto').OrderStatus;
      OrderType?: import('../dto').OrderType;
      PaymentStatus?: import('../dto').PaymentStatus;
      PaymentMethod?: import('../dto').PaymentMethod;
      PayoutStatus?: import('../dto').PayoutStatus;
      BannerPosition?: import('../dto').BannerPosition;
      BannerStatus?: import('../dto').BannerStatus;
      NotificationType?: import('../dto').NotificationType;
      NotificationStatus?: import('../dto').NotificationStatus;
      SettingCategory?: import('../dto').SettingCategory;
      AuditAction?: import('../dto').AuditAction;
      ApiResponse?: import('../dto').ApiResponse<unknown>;
      PaginatedResponse?: import('../dto').PaginatedResponse<unknown>;
    } = {};

    // If this compiles, all type exports are valid
    expect(typeValidation).toBeDefined();
  });

  it('should have properly typed API functions', async () => {
    const { equipmentApi } = await import('../api');

    expect(typeof equipmentApi.getEquipment).toBe('function');
    expect(typeof equipmentApi.getPendingApprovals).toBe('function');
    expect(typeof equipmentApi.approveEquipment).toBe('function');
    expect(typeof equipmentApi.rejectEquipment).toBe('function');
    expect(typeof equipmentApi.bulkApprove).toBe('function');
  });

  it('should have auction API functions', async () => {
    const { auctionApi } = await import('../api');

    expect(typeof auctionApi.getAuctions).toBe('function');
    expect(typeof auctionApi.createAuction).toBe('function');
    expect(typeof auctionApi.assignEquipment).toBe('function');
    expect(typeof auctionApi.cancelAuction).toBe('function');
  });

  it('should have order API functions', async () => {
    const { orderApi } = await import('../api');

    expect(typeof orderApi.getOrders).toBe('function');
    expect(typeof orderApi.getOrder).toBe('function');
    expect(typeof orderApi.updateOrderStatus).toBe('function');
    expect(typeof orderApi.cancelOrder).toBe('function');
  });

  it('should have payment API functions', async () => {
    const { paymentApi, payoutApi } = await import('../api');

    expect(typeof paymentApi.getPayments).toBe('function');
    expect(typeof paymentApi.refundPayment).toBe('function');

    expect(typeof payoutApi.getPayouts).toBe('function');
    expect(typeof payoutApi.approvePayout).toBe('function');
    expect(typeof payoutApi.holdPayout).toBe('function');
  });

  it('should have reports API functions', async () => {
    const { reportsApi } = await import('../api');

    expect(typeof reportsApi.getSalesReport).toBe('function');
    expect(typeof reportsApi.getAuctionReport).toBe('function');
    expect(typeof reportsApi.getUserActivityReport).toBe('function');
  });

  it('should have CMS API functions', async () => {
    const { bannerApi, staticPageApi } = await import('../api');

    expect(typeof bannerApi.getBanners).toBe('function');
    expect(typeof bannerApi.createBanner).toBe('function');

    expect(typeof staticPageApi.getPages).toBe('function');
    expect(typeof staticPageApi.createPage).toBe('function');
  });

  it('should have notification API functions', async () => {
    const { notificationApi } = await import('../api');

    expect(typeof notificationApi.getNotifications).toBe('function');
    expect(typeof notificationApi.sendNotification).toBe('function');
  });

  it('should have settings API functions', async () => {
    const { settingsApi } = await import('../api');

    expect(typeof settingsApi.getSettings).toBe('function');
    expect(typeof settingsApi.getSetting).toBe('function');
    expect(typeof settingsApi.updateSetting).toBe('function');
  });

  it('should have audit API functions', async () => {
    const { auditApi } = await import('../api');

    expect(typeof auditApi.getAuditLogs).toBe('function');
  });
});
