import { type JSX } from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { LogOut, AlertTriangle } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutConfirmModalProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Confirm Logout</h3>

        {/* Message */}
        <p className="mb-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          Are you sure you want to logout? You will need to login again to access your account.
        </p>

        {/* Actions */}
        <div className="flex w-full gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
