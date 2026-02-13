import { type JSX } from 'react';
import { Modal, Button, Badge } from '../../../components';
import type { PayoutDto } from '../../../dto';
import type { PayoutStatus } from '../../../dto';
import { PayoutStatusType } from '../../../dto';
import { formatCurrency } from '../../../utils';

interface PayoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutDto | null;
}

const PayoutDetailModal = ({ isOpen, onClose, payout }: PayoutDetailModalProps): JSX.Element => {
  if (!payout) return <></>;

  const getStatusBadge = (status: PayoutStatus) => {
    const variants: Record<PayoutStatus, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> =
      {
        [PayoutStatusType.PENDING]: 'warning',
        [PayoutStatusType.APPROVED]: 'info',
        [PayoutStatusType.PROCESSING]: 'info',
        [PayoutStatusType.COMPLETED]: 'success',
        [PayoutStatusType.FAILED]: 'danger',
        [PayoutStatusType.ON_HOLD]: 'warning',
      };
    return (
      <Badge variant={variants[status]} size="sm">
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payout Details">
      <div className="max-h-[70vh] space-y-6 overflow-y-auto">
        {/* Payout Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Payout Information
            </h3>
            {getStatusBadge(payout.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Payout ID</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {payout._id.slice(0, 16)}...
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Created Date</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(payout.createdAt).toLocaleString()}
              </p>
            </div>
            {payout.createdAt && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Processed Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(payout.createdAt).toLocaleString()}
                </p>
              </div>
            )}
            {payout.approvedAt && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Approved Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(payout.approvedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Seller Information */}
        {payout.seller && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Seller Information
            </h3>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">
                {payout.seller.firstName} {payout.seller.lastName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{payout.seller.email}</p>
            </div>
          </div>
        )}

        {/* Order Information */}
        {payout.order && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">
                Order #{payout.order.orderNumber}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order ID: {payout.order._id.slice(0, 16)}
              </p>
            </div>
          </div>
        )}

        {/* Amount Details */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Amount Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payout Amount</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formatCurrency(payout.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(payout.adminNotes || payout.holdReason) && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Additional Information
            </h3>

            {payout.adminNotes && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{payout.adminNotes}</p>
              </div>
            )}

            {payout.holdReason && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Hold Reason</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{payout.holdReason}</p>
              </div>
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

export default PayoutDetailModal;
