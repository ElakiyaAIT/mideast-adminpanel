import { type JSX } from 'react';
import { Modal, Button } from '../../../components';
import { AlertTriangle } from 'lucide-react';
import { useDeleteUser } from '../../../hooks/queries/useUser';
import type { UserResponseDto } from '../../../dto';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponseDto | null;
}

const DeleteUserModal = ({ isOpen, onClose, user }: DeleteUserModalProps): JSX.Element => {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async (): Promise<void> => {
    if (!user) return;

    try {
      await deleteUserMutation.mutateAsync(user.id);
      onClose();
    } catch (_error) {
      // Error handling is done in the mutation hook
    }
  };

  if (!user) return <></>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="md">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Are you sure?</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              You are about to delete the user{' '}
              <strong>
                {user.firstName} {user.lastName}
              </strong>{' '}
              ({user.email}). This action will soft delete the user and can be restored later if
              needed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500/20 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
