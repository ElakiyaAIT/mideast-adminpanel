import { useState, useMemo, type JSX, type FormEvent } from 'react';
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
  Modal,
  Select,
} from '../../components';
import { RefreshCw, Settings as SettingsIcon, Edit } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '../../hooks/queries';
import type {
  SystemSettingsQueryParams,
  SystemSettingDto,
  UpdateSystemSettingDto,
} from '../../dto';
import type { SettingCategory } from '../../dto';
import { SettingCategoryType } from '../../dto';

const SystemSettingsPage = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [categoryFilter, setCategoryFilter] = useState<SettingCategory | ''>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SystemSettingDto | null>(null);

  const [formData, setFormData] = useState<UpdateSystemSettingDto>({
    value: '',
  });

  const queryParams = useMemo(
    (): SystemSettingsQueryParams => ({
      page,
      limit,
      category: categoryFilter || undefined,
    }),
    [page, limit, categoryFilter],
  );

  const { data, isLoading, isFetching, refetch } = useSystemSettings(queryParams);
  const updateMutation = useUpdateSystemSetting();

  const handleEdit = (setting: SystemSettingDto): void => {
    setSelectedSetting(setting);
    setFormData({ value: setting.value });
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (selectedSetting) {
      await updateMutation.mutateAsync({ key: selectedSetting.key, data: formData });
      setIsEditModalOpen(false);
    }
  };

  const getCategoryBadge = (category: SettingCategory) => {
    const variants: Record<
      SettingCategory,
      'success' | 'warning' | 'danger' | 'info' | 'secondary'
    > = {
      [SettingCategoryType.GENERAL]: 'info',
      [SettingCategoryType.COMMISSION]: 'success',
      [SettingCategoryType.AUCTION]: 'warning',
      [SettingCategoryType.PAYMENT]: 'info',
      [SettingCategoryType.EMAIL]: 'secondary',
      [SettingCategoryType.SEO]: 'info',
      [SettingCategoryType.MAINTENANCE]: 'danger',
    };
    return (
      <Badge variant={variants[category]} size="sm">
        {category}
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

  const settings = data ? data.data : [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-gradient-brand text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="mt-1 text-base font-medium text-gray-600 dark:text-gray-400">
            Configure system-wide settings
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as SettingCategory | '');
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Categories' },
              ...Object.values(SettingCategoryType).map((cat) => ({
                value: cat,
                label: cat,
              })),
            ]}
          />
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead align="right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.length === 0 ? (
              <TableRow>
                <td colSpan={5} className="py-12">
                  <div className="text-center">
                    <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 font-medium text-gray-500">No settings found</p>
                  </div>
                </td>
              </TableRow>
            ) : (
              settings.map((setting: SystemSettingDto) => (
                <TableRow key={setting._id} hover>
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                      {setting.key}
                    </code>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-900 dark:text-white">{setting.value}</p>
                  </TableCell>
                  <TableCell>{getCategoryBadge(setting.category)}</TableCell>
                  <TableCell>
                    <p className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
                      {setting.description || '-'}
                    </p>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(setting)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Setting"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Key</label>
            <Input type="text" value={selectedSetting?.key || ''} disabled />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Value *</label>
            <Input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ value: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedSetting?.description || 'No description available'}
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SystemSettingsPage;
