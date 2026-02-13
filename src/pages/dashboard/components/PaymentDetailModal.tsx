import React, { useState, useEffect, useRef, type JSX } from 'react';
import { Modal, Input, Button, Badge } from '../../../components';
import { useRefundPayment } from '../../../hooks/queries';
import type { PaymentDto, RefundPaymentDto } from '../../../dto';
import type { PaymentStatus } from '../../../dto';
import { PaymentStatusType } from '../../../dto';
import { formatCurrency } from '../../../utils';

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentDto | null;
}

const PaymentDetailModal = ({ isOpen, onClose, payment }: PaymentDetailModalProps): JSX.Element => {
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundData, setRefundData] = useState<RefundPaymentDto>({
    reason: '',
    amount: undefined,
  });

  const refundMutation = useRefundPayment();

  const prevOpenRef = useRef(isOpen);
  const prevPaymentIdRef = useRef(payment?._id);

  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;
    const paymentChanged = payment?._id !== prevPaymentIdRef.current;

    if ((justOpened || paymentChanged) && payment) {
      // Use setTimeout to avoid setting state during render
      setTimeout(() => {
        setRefundData({
          reason: '',
          amount: undefined,
        });
        setIsRefunding(false);
      }, 0);
    }

    prevOpenRef.current = isOpen;
    prevPaymentIdRef.current = payment?._id;
  }, [payment, isOpen]);

  if (!payment) return <></>;

  const handleRefund = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await refundMutation.mutateAsync({ id: payment._id, data: refundData });
    setIsRefunding(false);
    onClose();
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const variants: Record<PaymentStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> =
      {
        [PaymentStatusType.PENDING]: 'warning',
        [PaymentStatusType.PROCESSING]: 'info',
        [PaymentStatusType.COMPLETED]: 'success',
        [PaymentStatusType.FAILED]: 'danger',
        [PaymentStatusType.REFUNDED]: 'secondary',
        [PaymentStatusType.PARTIALLY_REFUNDED]: 'warning',
      };
    return (
      <Badge variant={variants[status]} size="sm">
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const canRefund =
    payment.status === PaymentStatusType.COMPLETED ||
    payment.status === PaymentStatusType.PARTIALLY_REFUNDED;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Payment Details`}>
      <div className="max-h-[70vh] space-y-6 overflow-y-auto">
        {/* Payment Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payment Information
            </h3>
            {getStatusBadge(payment.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Transaction ID</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {payment.transactionId || payment._id.slice(0, 16)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {payment.paymentMethod.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Payment Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(payment.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(payment.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Information */}
        {payment.order && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">
                Order #{payment.order.orderNumber}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order ID: {payment.order._id.slice(0, 16)}
              </p>
            </div>
          </div>
        )}

        {/* Payment Details */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Amount Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Amount</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            {payment.refundedAmount && payment.refundedAmount > 0 && (
              <>
                <div className="flex justify-between text-red-600">
                  <span>Refunded Amount</span>
                  <span className="font-semibold">-{formatCurrency(payment.refundedAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Remaining Amount
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(payment.amount - payment.refundedAmount)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Refund Information */}
        {payment.refundReason && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Refund Reason</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{payment.refundReason}</p>
            {payment.refundedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Refunded on {new Date(payment.refundedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Refund Form */}
        {canRefund && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Process Refund
              </h3>
              {!isRefunding && (
                <Button variant="outline" size="sm" onClick={() => setIsRefunding(true)}>
                  Refund Payment
                </Button>
              )}
            </div>

            {isRefunding && (
              <form onSubmit={handleRefund} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Refund Reason *</label>
                  <textarea
                    value={refundData.reason}
                    onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    rows={3}
                    required
                    placeholder="Explain the reason for this refund..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Refund Amount (Optional)</label>
                  <Input
                    type="number"
                    value={refundData.amount || ''}
                    onChange={(e) =>
                      setRefundData({
                        ...refundData,
                        amount: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    min="0.01"
                    max={
                      payment.status === PaymentStatusType.PARTIALLY_REFUNDED
                        ? payment.amount - (payment.refundedAmount || 0)
                        : payment.amount
                    }
                    step="0.01"
                    placeholder={`Leave empty for full refund (${formatCurrency(
                      payment.status === PaymentStatusType.PARTIALLY_REFUNDED
                        ? payment.amount - (payment.refundedAmount || 0)
                        : payment.amount,
                    )})`}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Leave empty to refund the full amount. Enter a partial amount for partial
                    refunds.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" variant="danger" disabled={refundMutation.isPending}>
                    {refundMutation.isPending ? 'Processing...' : 'Process Refund'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsRefunding(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDetailModal;
