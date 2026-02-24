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
  Pagination,
} from '../../components';
import { Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { useUsersList } from '../../hooks/queries/useUser';
import { useDebounce } from '../../hooks/useDebounce';
import type { UserListQueryParams, UserResponseDto } from '../../dto';
import UserFormModal from './components/UserFormModal';
import DeleteUserModal from './components/DeleteUserModal';
import type { ColumnConfig } from '../../components/Skeleton/TableSkeleton';
import TableSkeleton from '../../components/Skeleton/TableSkeleton';

const UsersPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<UserListQueryParams['sortBy']>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);

  //Skelton column config
  const UserColumns: ColumnConfig[] = [
    { width: 150, count: 2 }, // user
    { width: 150 }, // email
    { width: 100, variant: 'rounded' }, // role
    { width: 100, variant: 'rounded' }, // status
    { width: 90, variant: 'rounded' }, // last login
    { width: 60, horizontalCount: 2, variant: 'rounded' }, // Actions
  ];

  // Debounce search term to avoid excessive API calls
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Build query params
  const queryParams = useMemo(
    (): UserListQueryParams => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      sortBy,
      sortOrder,
    }),
    [page, limit, debouncedSearch, sortBy, sortOrder],
  );

  // Fetch users with React Query
  const { data, isLoading, isFetching, isError, error, refetch } = useUsersList(queryParams);

  // Reset to page 1 when search term changes
  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (field: UserListQueryParams['sortBy']): void => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const getRoleBadgeVariant = (roleName?: string) => {
    if (!roleName) return 'secondary';

    switch (roleName.toLowerCase()) {
      case 'admin':
      case 'super_admin':
        return 'danger';
      case 'seller':
        return 'warning';
      case 'buyer':
        return 'success';
      default:
        return 'secondary';
    }
  };

  // Modal handlers
  const handleAddUser = (): void => {
    setSelectedUser(null);
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: UserResponseDto): void => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserResponseDto): void => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = (): void => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Loading skeleton
  if (isLoading && !data) {
    return (
      <div className="mt-10 animate-fade-in space-y-6">
        <TableSkeleton columns={UserColumns} rows={5} cardWrapper={true} />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage and monitor all system users
          </p>
        </div>
        <Card>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                Failed to load users
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
              <Button variant="primary" size="md" onClick={() => refetch()} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const users = data?.items || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Manage and monitor all system users
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        {debouncedSearch && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Found {total} {total === 1 ? 'user' : 'users'} matching "{debouncedSearch}"
          </div>
        )}
      </Card>

      {/* Users Table */}
      <Card>
        <div className="relative">
          {/* Loading overlay for pagination/refetch */}
          {isFetching && data && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead
                  onClick={() => handleSort('email')}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  onClick={() => handleSort('lastLoginAt')}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Last Login {sortBy === 'lastLoginAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead align="right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="py-12">
                    <div className="text-center">
                      <p className="font-medium text-gray-500 dark:text-gray-400">No users found</p>
                      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        {searchTerm
                          ? 'Try adjusting your search criteria'
                          : 'Get started by adding a new user'}
                      </p>
                    </div>
                  </td>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="hover:shadow-glow-brand-lg flex h-10 w-10 items-center justify-center rounded-xl border border-primary-400/30 bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300">
                          {user.firstName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {user.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.roleName)} size="sm">
                        {user.roleName || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.isActive ? 'success' : 'secondary'} size="sm">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {user.isEmailVerified && (
                          <Badge variant="info" size="sm">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Never'}
                      </p>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit user"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete user"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {users.length > 0 ? (page - 1) * limit + 1 : 0} to{' '}
              {Math.min(page * limit, total)} of {total} users
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>

      {/* Modals */}
      <UserFormModal isOpen={isAddModalOpen} onClose={handleCloseModals} mode="create" />

      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        user={selectedUser}
        mode="edit"
      />

      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={handleCloseModals} user={selectedUser} />
    </div>
  );
};

export default UsersPage;
