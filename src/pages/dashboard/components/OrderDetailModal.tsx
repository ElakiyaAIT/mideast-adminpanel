import { useState, useEffect, useRef, type JSX } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Input, Button, Select, Badge, PromptDialog, Textarea } from '../../../components';
import { useUpdateOrderStatus, useCancelOrder } from '../../../hooks/queries';
import type { OrderDto } from '../../../dto';
import { OrderStatusType } from '../../../dto';
import type { OrderStatus } from '../../../dto';
import { formatCurrency, orderUpdateSchema, type OrderUpdateFormData } from '../../../utils';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDto | null;
}

const OrderDetailModal = ({ isOpen, onClose, order }: OrderDetailModalProps): JSX.Element => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const prevOpenRef = useRef(isOpen);
  const prevOrderIdRef = useRef(order?._id);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      status: OrderStatusType.PENDING,
      trackingNumber: undefined,
      adminNotes: undefined,
    },
  });

  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;
    const orderChanged = order?._id !== prevOrderIdRef.current;

    if ((justOpened || orderChanged) && order) {
      reset({
        status: order.status,
        trackingNumber: order.trackingNumber || undefined,
        adminNotes: order.adminNotes || undefined,
      });
    }

    prevOpenRef.current = isOpen;
    prevOrderIdRef.current = order?._id;
  }, [order, isOpen, reset]);

  if (!order) return <></>;

  const onSubmit = async (data: OrderUpdateFormData): Promise<void> => {
    await updateStatusMutation.mutateAsync({
      id: order._id,
      data: {
        status: data.status,
        trackingNumber: data.trackingNumber ?? undefined,
        adminNotes: data.adminNotes ?? undefined,
      },
    });
    setIsEditingStatus(false);
    onClose();
  };

  const handleCancelOrder = (): void => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancelOrder = async (reason: string): Promise<void> => {
    if (order) {
      await cancelOrderMutation.mutateAsync({ id: order._id, data: { reason } });
      onClose();
    }
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.orderNumber}`}>
      <div className="max-h-[70vh] space-y-6 overflow-y-auto">
        {/* Order Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order Information
            </h3>
            {getStatusBadge(order.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Order Number</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Order Type</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.type.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Order Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(order.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Equipment Information */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equipment</h3>
          {order.equipment && (
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">{order.equipment.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.equipment.year} {order.equipment.make} {order.equipment.model}
              </p>
            </div>
          )}
        </div>

        {/* Buyer & Seller Information */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Buyer</h3>
            {order.buyer && (
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.buyer.firstName} {order.buyer.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.buyer.email}</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Seller</h3>
            {order.seller && (
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.seller.firstName} {order.seller.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.seller.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Price</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Commission</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.commission)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold text-gray-900 dark:text-white">Total Amount</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Shipping Address
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Status Update Form */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Update Order Status
            </h3>
            {!isEditingStatus && (
              <Button variant="outline" size="sm" onClick={() => setIsEditingStatus(true)}>
                Edit Status
              </Button>
            )}
          </div>

          {isEditingStatus ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Status"
                    {...field}
                    error={errors.status?.message}
                    options={Object.values(OrderStatusType).map((status) => ({
                      value: status,
                      label: status.replace(/_/g, ' ').toUpperCase(),
                    }))}
                  />
                )}
              />

              <Input
                label="Tracking Number"
                type="text"
                {...register('trackingNumber')}
                error={errors.trackingNumber?.message}
                placeholder="e.g., TRACK123456"
              />

              <Textarea
                label="Admin Notes"
                {...register('adminNotes')}
                error={errors.adminNotes?.message}
                placeholder="Optional internal notes..."
                rows={3}
              />

              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={updateStatusMutation.isPending}>
                  {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditingStatus(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2 text-sm">
              {order.trackingNumber && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Tracking Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
              {order.adminNotes && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Admin Notes</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-4">
          {order.status !== OrderStatusType.CANCELLED &&
            order.status !== OrderStatusType.COMPLETED && (
              <Button
                variant="danger"
                onClick={handleCancelOrder}
                disabled={cancelOrderMutation.isPending}
              >
                {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <PromptDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onSubmit={confirmCancelOrder}
        title="Cancel Order"
        message="Please provide a reason for cancelling this order:"
        placeholder="Enter cancellation reason..."
        confirmText="Cancel Order"
        isLoading={cancelOrderMutation.isPending}
        multiline
      />
    </Modal>
  );
};

export default OrderDetailModal;
