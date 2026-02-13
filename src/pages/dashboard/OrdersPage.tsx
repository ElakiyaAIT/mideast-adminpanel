import { useState, useMemo, type JSX } from 'react';
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
  Input,
  Skeleton,
  Pagination,
  Select,
} from '../../components';
import { Search, RefreshCw, ShoppingCart, Eye } from 'lucide-react';
import { useOrders } from '../../hooks/queries';
import { useDebounce } from '../../hooks/useDebounce';
import type { OrderQueryParams, OrderDto } from '../../dto';
import { OrderStatusType } from '../../dto';
import type { OrderStatus } from '../../dto';
import { formatCurrency } from '../../utils';
import OrderDetailModal from './components/OrderDetailModal';

const OrdersPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryParams = useMemo(
    (): OrderQueryParams => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
    }),
    [page, limit, debouncedSearch, statusFilter],
  );

  const { data, isLoading, isFetching, refetch } = useOrders(queryParams);

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleViewOrder = (order: OrderDto): void => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
      [OrderStatusType.PENDING]: 'warning',
      [OrderStatusType.PAYMENT_PENDING]: 'warning',
      [OrderStatusType.PAID]: 'info',
      [OrderStatusType.PROCESSING]: 'info',
      [OrderStatusType.SHIPPED]: 'info',
      [OrderStatusType.DELIVERED]: 'success',
      [OrderStatusType.COMPLETED]: 'success',
      [OrderStatusType.CANCELLED]: 'danger',
      [OrderStatusType.REFUNDED]: 'secondary',
    };
    return (
      <Badge variant={variants[status]} size="sm">
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  if (isLoading && !data) {
    return (
      <div className="animate-fade-in space-y-6">
        <Skeleton variant="text" width="250px" height={40} />
        <Card>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Card>
      </div>
    );
  }

  const orders = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
          Manage customer orders
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | '');
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Status' },
              ...Object.values(OrderStatusType).map((status) => ({
                value: status,
                label: status.replace(/_/g, ' '),
              })),
            ]}
          />
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="py-12">
                  <div className="text-center">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No orders found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              orders.map((order: OrderDto) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {order._id.slice(0, 8)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.buyer?.firstName} {order.buyer?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{order.buyer?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {order.equipment?.title || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="View order details"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {orders.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} orders
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersPage;
