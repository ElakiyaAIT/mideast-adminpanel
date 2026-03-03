// DeleteUserModal.test.tsx
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useDeleteUser } from '../../../hooks/queries/useUser';
import DeleteUserModal from '../../../pages/dashboard/components/DeleteUserModal';
import type { UserResponseDto } from '../../../dto';

// Mock the mutation hook
vi.mock('../../../hooks/queries/useUser', () => ({
  useDeleteUser: vi.fn(),
}));

const mockUser: UserResponseDto = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  roleId: {
    _id: '',
    name: '',
  },
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('DeleteUserModal', () => {
  let mutateAsyncMock: ReturnType<typeof vi.fn>;
  const mockUseDeleteUser = useDeleteUser as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mutateAsyncMock = vi.fn().mockResolvedValue(undefined);

    mockUseDeleteUser.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    });
  });

  it('renders modal with user info', async () => {
    render(<DeleteUserModal isOpen={true} onClose={vi.fn()} user={mockUser} />);

    // Modal title
    const title = screen.getByRole('heading', { name: 'Delete User' });
    expect(title).toBeInTheDocument();

    // Confirmation text
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/\(john.doe@example.com\)/)).toBeInTheDocument();

    // Delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete User' });
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<DeleteUserModal isOpen={true} onClose={onCloseMock} user={mockUser} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls deleteUserMutation when Delete User button is clicked', async () => {
    const onCloseMock = vi.fn();
    render(<DeleteUserModal isOpen={true} onClose={onCloseMock} user={mockUser} />);

    const deleteButton = screen.getByRole('button', { name: /delete user/i });
    fireEvent.click(deleteButton);

    // Wait for the async mutation to resolve
    await expect(mutateAsyncMock).toHaveBeenCalledWith('1');
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('disables buttons and shows loading text when deleting', () => {
    mockUseDeleteUser.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: true,
    });
    render(<DeleteUserModal isOpen={true} onClose={vi.fn()} user={mockUser} />);

    const deleteButton = screen.getByRole('button', { name: /deleting.../i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(deleteButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('renders nothing if user is null', () => {
    const { container } = render(<DeleteUserModal isOpen={true} onClose={vi.fn()} user={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
