import { useState, type JSX } from 'react';
import { Card, Button, Skeleton, Input } from '../../components';
import { Download, FileText, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useSalesReport, useAuctionReport, useUserActivityReport } from '../../hooks/queries';
import { formatCurrency } from '../../utils';
import type {
  SalesReportQueryParams,
  AuctionReportQueryParams,
  UserActivityReportQueryParams,
} from '../../dto';

const ReportsPage = (): JSX.Element => {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-01-31');
  const [reportType, setReportType] = useState<'sales' | 'auction' | 'user'>('sales');

  const salesParams: SalesReportQueryParams = {
    startDate,
    endDate,
    groupBy: 'day',
  };

  const auctionParams: AuctionReportQueryParams = {
    startDate,
    endDate,
  };

  const userParams: UserActivityReportQueryParams = {
    startDate,
    endDate,
  };

  const {
    data: salesData,
    isLoading: salesLoading,
    refetch: refetchSales,
  } = useSalesReport(salesParams);
  const {
    data: auctionData,
    isLoading: auctionLoading,
    refetch: refetchAuction,
  } = useAuctionReport(auctionParams);
  const {
    data: userData,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useUserActivityReport(userParams);

  const handleGenerate = (): void => {
    if (reportType === 'sales') void refetchSales();
    else if (reportType === 'auction') void refetchAuction();
    else void refetchUser();
  };

  const isLoading = salesLoading || auctionLoading || userLoading;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Generate and view business reports
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleGenerate} disabled={isLoading}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'sales' | 'auction' | 'user')}
              className="w-full rounded-lg border p-2 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="sales">Sales Report</option>
              <option value="auction">Auction Report</option>
              <option value="user">User Activity Report</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Start Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">End Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button variant="outline" size="md" onClick={handleGenerate} disabled={isLoading}>
              <Calendar className="mr-2 h-4 w-4" />
              Apply Filter
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Card>
      ) : (
        <>
          {reportType === 'sales' && salesData && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(salesData.data.totalRevenue)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {salesData.data.totalOrders}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Commission Earned
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(salesData.data.totalCommission)}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {reportType === 'auction' && auctionData && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Total Auctions
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {auctionData.data.totalAuctions}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Total Bids
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {auctionData.data.totalBids}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Items Sold
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {auctionData.data.liveAuctions}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {reportType === 'user' && userData && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      New Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {userData.data.newUsers}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {userData.data.activeUsers}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                      Total Logins
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {userData.data.totalSellers}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
