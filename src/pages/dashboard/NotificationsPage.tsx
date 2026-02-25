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
  Pagination,
  Modal,
  Input,
  Select,
} from '../../components';
import { RefreshCw, Bell, Send } from 'lucide-react';
import { useNotifications, useSendNotification, useUsersList } from '../../hooks/queries';
import type {
  NotificationQueryParams,
  NotificationDto,
  SendNotificationDto,
  UserListQueryParams,
} from '../../dto';
import { NotificationStatusType, NotificationTypeType } from '../../dto';
import type { NotificationStatus, NotificationType } from '../../dto';
import { notificationSchema } from '../../utils/validation';
import ReactSelect from 'react-select';
import { ValidationError } from 'yup';
import type { ColumnConfig } from '../../components/Skeleton/TableSkeleton';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';

const NotificationsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Skeleton Column Config
  const notificationColumns: ColumnConfig[] = [
    { width: 150 }, // Notification
    { width: 80, variant: 'rounded' }, // Type
    { width: 100, variant: 'rounded' }, // Status
    { width: 200 }, // SentAt
  ];

  const [formData, setFormData] = useState<SendNotificationDto>({
    recipientIds: [],
    type: NotificationTypeType.EMAIL,
    title: '',
    message: '',
    subject: '',
  });

  const queryParams = useMemo(
    (): NotificationQueryParams => ({
      page,
      limit,
    }),
    [page, limit],
  );

  // const sortBy = 'createdAt';
  // const sortOrder = 'desc';
  const userQueryParams = useMemo(
    (): UserListQueryParams => ({
      page,
      limit,
      // search: debouncedSearch || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    [page, limit],
  );
  const {
    data: userData,
    // isLoading: userIsLoading,
    // isFetching: userIsFetching,
    // isError,
    // error,
    // refetch: userRefetch,
  } = useUsersList(userQueryParams);
  const { data, isLoading, isFetching, refetch } = useNotifications(queryParams);
  const sendMutation = useSendNotification();

  const users = userData?.items || [];
  // console.log(userData, 'user123');

  const handleSend = (): void => {
    setFormData({
      recipientIds: [],
      type: NotificationTypeType.EMAIL,
      title: '',
      message: '',
      subject: '',
    });
    setIsSendModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setErrors({});

      await notificationSchema.validate(formData, {
        abortEarly: false, // collect all errors
      });

      await sendMutation.mutateAsync(formData);
      setIsSendModalOpen(false);
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationErrors: Record<string, string> = {};

        error.inner.forEach((err) => {
          if (err.path && !validationErrors[err.path]) {
            validationErrors[err.path] = err.message;
          }
        });

        setErrors(validationErrors);
      }
    }
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

  //loading skeleton
  if (isLoading && !data) {
    return (
      <div className="mt-10 animate-fade-in space-y-6">
        <TableSkeleton columns={notificationColumns} rows={5} cardWrapper={true} />
      </div>
    );
  }

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} (${user.email})`,
  }));
  const notifications = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;
  const totalPages = data?.data?.pagination?.totalPages || 1;

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
                      <p
                        className="tuncate font-semibold text-gray-900 dark:text-white"
                        title={notification?.subject}
                      >
                        {notification.subject}
                      </p>
                      <p
                        className="truncate text-sm text-gray-600 dark:text-gray-400"
                        title={notification?.message}
                      >
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
            <label className="mb-2 block text-sm font-medium">
              Type <span className="text-xs text-red-500">*</span>
            </label>
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
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Select User <span className="text-xs text-red-500">*</span>
            </label>
            <ReactSelect
              isMulti
              options={userOptions}
              value={userOptions.filter((option) =>
                (formData?.recipientIds ?? []).includes(option.value),
              )}
              onChange={(selectedOptions) =>
                setFormData({
                  ...formData,
                  recipientIds: selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : [],
                })
              }
              className="react-select-container rounded-xl"
              classNamePrefix="react-select"
            />

            {errors.recipientIds && (
              <p className="mt-1 text-xs text-red-500">{errors.recipientIds}</p>
            )}
          </div>

          <div>
            {/* <label className="mb-2 block text-sm font-medium">Title *</label> */}
            <Input
              label="Title"
              error={errors?.title}
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            {/* <label className="mb-2 block text-sm font-medium">Title *</label> */}
            <Input
              label="Subject"
              error={errors?.subject}
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Message <span className="text-xs text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border p-2 dark:border-gray-600 dark:bg-gray-800"
              rows={4}
              // required
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
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
