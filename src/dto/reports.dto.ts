// Reports DTOs

// ============================================
// SALES REPORT DTOs
// ============================================

export interface SalesReportDto {
  period: string;
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  averageOrderValue: number;
  buyNowSales: number;
  auctionSales: number;
}

export interface SalesReportQueryParams {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

// ============================================
// AUCTION REPORT DTOs
// ============================================

export interface AuctionReportDto {
  totalAuctions: number;
  liveAuctions: number;
  completedAuctions: number;
  totalEquipment: number;
  totalBids: number;
  averageBidsPerAuction: number;
  totalRevenue: number;
  topAuctions: {
    _id: string;
    title: string;
    equipmentCount: number;
    totalBids: number;
    revenue: number;
  }[];
}

export interface AuctionReportQueryParams {
  startDate: string;
  endDate: string;
}

// ============================================
// USER ACTIVITY REPORT DTOs
// ============================================

export interface UserActivityReportDto {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalBuyers: number;
  totalSellers: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  topBuyers: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
  }[];
  topSellers: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalSales: number;
    totalRevenue: number;
  }[];
}

export interface UserActivityReportQueryParams {
  startDate: string;
  endDate: string;
}
