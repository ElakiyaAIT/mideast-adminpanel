import React, { useState, useMemo, type JSX } from 'react';
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
  Skeleton,
  Pagination,
  Modal,
  Input,
  Select,
} from '../../components';
import { RefreshCw, Bell, Send } from 'lucide-react';
import { useNotifications, useSendNotification } from '../../hooks/queries';
import type { NotificationQueryParams, NotificationDto, SendNotificationDto } from '../../dto';
import { NotificationStatusType, NotificationTypeType } from '../../dto';
import type { NotificationStatus, NotificationType } from '../../dto';

const NotificationsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const [formData, setFormData] = useState<SendNotificationDto>({
    userIds: [],
    type: NotificationTypeType.SYSTEM,
    title: '',
    message: '',
  });

  const queryParams = useMemo(
    (): NotificationQueryParams => ({
      page,
      limit,
    }),
    [page, limit],
  );

  const { data, isLoading, isFetching, refetch } = useNotifications(queryParams);
  const sendMutation = useSendNotification();

  const handleSend = (): void => {
    setFormData({
      userIds: [],
      type: NotificationTypeType.SYSTEM,
      title: '',
      message: '',
    });
    setIsSendModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await sendMutation.mutateAsync(formData);
    setIsSendModalOpen(false);
  };

  const getStatusBadge = (status: NotificationStatus) => {
    const variants: Record<NotificationStatus, 'success' | 'warning' | 'danger'> = {
      [NotificationStatusType.PENDING]: 'warning',
      [NotificationStatusType.SENT]: 'success',
      [NotificationStatusType.FAILED]: 'danger',
    };
    return (
      <Badge variant={variants[status]} size="sm">
        {status}
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

  const notifications = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage system notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="md" onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Notification</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <td colSpan={4} className="py-12">
                  <div className="text-center">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No notifications found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              notifications.map((notification: NotificationDto) => (
                <TableRow key={notification._id} hover>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" size="sm">
                      {notification.type.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {notification.sentAt
                        ? new Date(notification.sentAt).toLocaleString()
                        : 'Not sent'}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {notifications.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} notifications
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </Card>

      {/* Send Modal */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Notification"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Type *</label>
            <Select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as NotificationType })
              }
              options={Object.values(NotificationTypeType).map((type) => ({
                value: type,
                label: type.replace(/_/g, ' '),
              }))}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Title *</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border p-2 dark:border-gray-600 dark:bg-gray-800"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={sendMutation.isPending}>
              {sendMutation.isPending ? 'Sending...' : 'Send'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsSendModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
