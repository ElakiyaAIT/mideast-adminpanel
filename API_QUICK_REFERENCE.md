# Admin Panel API Quick Reference

A quick reference guide for all integrated APIs in the Admin Panel.

## Import Pattern

```typescript
import {
  equipmentApi,
  equipmentCategoryApi,
  auctionApi,
  orderApi,
  paymentApi,
  payoutApi,
  reportsApi,
  bannerApi,
  staticPageApi,
  notificationApi,
  settingsApi,
  auditApi,
} from '@/api';

import type {
  EquipmentDto,
  AuctionDto,
  OrderDto,
  // ... other types
} from '@/dto';
```

---

## Equipment Management

### Equipment Categories

```typescript
// List categories
equipmentCategoryApi.getCategories({ page: 1, limit: 20, isActive: true })

// Get single category
equipmentCategoryApi.getCategory(id)

// Create
equipmentCategoryApi.createCategory({ name, slug, description, ... })

// Update
equipmentCategoryApi.updateCategory(id, { name, description, ... })

// Delete (soft)
equipmentCategoryApi.deleteCategory(id)

// Restore
equipmentCategoryApi.restoreCategory(id)
```

### Equipment

```typescript
// List equipment
equipmentApi.getEquipment({ status: EquipmentStatus.ACTIVE, page: 1, limit: 20 })

// Pending approvals
equipmentApi.getPendingApprovals(page, limit)

// Get single
equipmentApi.getEquipmentById(id)

// Create
equipmentApi.createEquipment({ title, description, categoryId, ... })

// Update
equipmentApi.updateEquipment(id, { title, price, ... })

// Approve
equipmentApi.approveEquipment(id, { isPublished: true, isFeatured: false })

// Reject
equipmentApi.rejectEquipment(id, { rejectionReason: 'Not meeting standards' })

// Bulk approve
equipmentApi.bulkApprove({ equipmentIds: [id1, id2], isPublished: true })

// Delete
equipmentApi.deleteEquipment(id)
```

---

## Auction Management

```typescript
// List auctions
auctionApi.getAuctions({ status: AuctionStatus.LIVE, page: 1, limit: 20 })

// Get single
auctionApi.getAuction(id)

// Get auction equipment
auctionApi.getAuctionEquipment(id)

// Get auction bids
auctionApi.getAuctionBids(id)

// Create
auctionApi.createAuction({ title, description, type, startDate, endDate, ... })

// Update
auctionApi.updateAuction(id, { title, endDate, ... })

// Assign equipment
auctionApi.assignEquipment(id, { equipmentIds: [id1, id2, id3] })

// Cancel
auctionApi.cancelAuction(id)

// Delete
auctionApi.deleteAuction(id)
```

---

## Order Management

```typescript
// List orders
orderApi.getOrders({ status: OrderStatus.PAID, page: 1, limit: 20 });

// Get single
orderApi.getOrder(id);

// Update status
orderApi.updateOrderStatus(id, {
  status: OrderStatus.SHIPPED,
  trackingNumber: 'TRACK123',
  adminNotes: 'Notes...',
});

// Cancel
orderApi.cancelOrder(id, { reason: 'Customer request' });
```

---

## Payment & Payout Management

### Payments

```typescript
// List payments
paymentApi.getPayments({ status: PaymentStatus.COMPLETED, page: 1, limit: 20 });

// Get single
paymentApi.getPayment(id);

// Refund
paymentApi.refundPayment(id, {
  reason: 'Customer request',
  amount: 500, // optional for partial refund
});
```

### Payouts

```typescript
// List payouts
payoutApi.getPayouts({ status: PayoutStatus.PENDING, page: 1, limit: 20 });

// Get single
payoutApi.getPayout(id);

// Approve
payoutApi.approvePayout(id, { notes: 'Approved' });

// Hold
payoutApi.holdPayout(id, { holdReason: 'Verification needed' });
```

---

## Reports

```typescript
// Sales report
reportsApi.getSalesReport({
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  groupBy: 'day', // 'day' | 'week' | 'month' | 'year'
});

// Auction report
reportsApi.getAuctionReport({
  startDate: '2026-01-01',
  endDate: '2026-01-31',
});

// User activity report
reportsApi.getUserActivityReport({
  startDate: '2026-01-01',
  endDate: '2026-01-31',
});
```

---

## CMS Management

### Banners

```typescript
// List banners
bannerApi.getBanners()

// Get single
bannerApi.getBanner(id)

// Create
bannerApi.createBanner({
  title: 'Winter Sale',
  imageUrl: 'https://...',
  linkUrl: '/sale',
  position: BannerPosition.HOME_HERO,
  status: BannerStatus.ACTIVE,
  startDate: '2026-01-01',
  endDate: '2026-01-31'
})

// Update
bannerApi.updateBanner(id, { title, status, ... })

// Delete
bannerApi.deleteBanner(id)
```

### Static Pages

```typescript
// List pages
staticPageApi.getPages()

// Get single
staticPageApi.getPage(slug)

// Create
staticPageApi.createPage({
  title: 'About Us',
  slug: 'about-us',
  content: '<p>Content...</p>',
  metaTitle: 'About Us - Heavy Equipment',
  metaDescription: 'Learn about our company',
  metaKeywords: ['about', 'company'],
  isPublished: true
})

// Update
staticPageApi.updatePage(slug, { content, metaTitle, ... })

// Delete
staticPageApi.deletePage(slug)
```

---

## Notification Management

```typescript
// List notifications
notificationApi.getNotifications({
  status: NotificationStatus.SENT,
  page: 1,
  limit: 20,
});

// Send notification
notificationApi.sendNotification({
  userId: 'user123', // or userIds: ['user1', 'user2']
  type: NotificationType.SYSTEM,
  title: 'System Update',
  message: 'Scheduled maintenance...',
  data: { key: 'value' }, // optional metadata
});
```

---

## System Settings

```typescript
// List settings
settingsApi.getSettings({ category: SettingCategory.COMMISSION });

// Get single setting
settingsApi.getSetting('commission_percentage');

// Update setting
settingsApi.updateSetting('commission_percentage', { value: '3.5' });
```

---

## Audit Logs

```typescript
// List audit logs
auditApi.getAuditLogs({
  adminId: 'admin123',
  action: AuditAction.APPROVE,
  targetType: 'Equipment',
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  page: 1,
  limit: 50,
});
```

---

## Common Enums

### Equipment

- `EquipmentStatus`: draft, pending_approval, approved, rejected, active, sold, archived
- `ListingType`: buy_now, auction, both

### Auction

- `AuctionStatus`: draft, scheduled, live, ended, cancelled
- `AuctionType`: online, live, timed
- `BidStatus`: active, outbid, winning, won, lost

### Order

- `OrderStatus`: pending, payment_pending, paid, processing, shipped, delivered, completed, cancelled, refunded
- `OrderType`: buy_now, auction_win

### Payment

- `PaymentStatus`: pending, processing, completed, failed, refunded, partially_refunded
- `PaymentMethod`: credit_card, debit_card, bank_transfer, paypal, stripe

### Payout

- `PayoutStatus`: pending, approved, processing, completed, failed, on_hold

### CMS

- `BannerPosition`: home_hero, home_secondary, category_top, sidebar, footer
- `BannerStatus`: active, inactive, scheduled, expired

### Notification

- `NotificationType`: system, equipment_approved, equipment_rejected, bid_placed, bid_outbid, auction_ending, auction_won, order_placed, order_shipped, order_delivered, payment_received, payout_processed, account_verified, account_suspended
- `NotificationStatus`: pending, sent, failed

### Settings

- `SettingCategory`: general, commission, auction, payment, email, seo, maintenance

### Audit

- `AuditAction`: create, update, delete, approve, reject, cancel, verify, suspend, block, restore, login, logout, refund, payout

---

## Response Types

All API calls return `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

Paginated endpoints return:

```typescript
{
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## Error Handling

Errors are automatically handled by the axios interceptor. To handle specific errors:

```typescript
try {
  await equipmentApi.approveEquipment(id, data);
} catch (error) {
  // Handle error
  console.error('Failed to approve equipment:', error);
}
```

---

## React Query Usage Example

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentApi } from '@/api';

// Query
const { data, isLoading, error } = useQuery({
  queryKey: ['equipment', filters],
  queryFn: () => equipmentApi.getEquipment(filters),
});

// Mutation
const queryClient = useQueryClient();
const approveMutation = useMutation({
  mutationFn: ({ id, data }) => equipmentApi.approveEquipment(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries(['equipment']);
  },
});

// Usage
approveMutation.mutate({ id, data: { isPublished: true } });
```

---

## Tips

1. **Pagination**: Most list endpoints support `page` and `limit` params (default 20)
2. **Filtering**: Use query params to filter results
3. **Soft Deletes**: Most delete operations are soft deletes and can be restored
4. **Type Safety**: All DTOs are strongly typed - use TypeScript autocomplete
5. **Error Handling**: Errors are caught by axios interceptor, but handle specific cases in UI
6. **Authentication**: All endpoints require JWT token (handled automatically)
7. **Caching**: Use React Query for intelligent caching and state management

---

## Backend Endpoints

All APIs call endpoints under `/admin/*`:

- Equipment: `/admin/equipment/*`, `/admin/equipment-categories/*`
- Auctions: `/admin/auctions/*`
- Orders: `/admin/orders/*`
- Payments: `/admin/payments/*`
- Payouts: `/admin/payouts/*`
- Reports: `/admin/reports/*`
- CMS: `/admin/cms/banners/*`, `/admin/cms/pages/*`
- Notifications: `/admin/notifications/*`
- Settings: `/admin/settings/*`
- Audit: `/admin/audit-logs/*`

---

For detailed documentation, see `ADMIN_PANEL_API_INTEGRATION.md`
