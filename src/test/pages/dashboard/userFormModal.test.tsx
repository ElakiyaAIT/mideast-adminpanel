import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserFormModal from '../../../pages/dashboard/components/UserFormModal';
import { useRoles } from '../../../hooks/queries/useRole';
import { useCreateUser, useUpdateUser } from '../../../hooks/queries/useUser';
import type { UserResponseDto } from '../../../dto';
import React from 'react';

// --------------------
// Mocks
// --------------------
vi.mock('../../../hooks/queries/useRole');
vi.mock('../../../hooks/queries/useUser');

const mockUseRoles = useRoles as unknown as ReturnType<typeof vi.fn>;
const mockUseCreateUser = useCreateUser as unknown as ReturnType<typeof vi.fn>;
const mockUseUpdateUser = useUpdateUser as unknown as ReturnType<typeof vi.fn>;
const mockRoles = [
  { id: 'role1', name: 'Admin' },
  { id: 'role2', name: 'Buyer' },
];

const mockUser: UserResponseDto = {
  id: 'user1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  roleId: { _id: 'role1', name: 'Admin' },
  roleName: 'Admin',
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: null,
  createdAt: '',
  updatedAt: '',
};

const mockCreate = { mutateAsync: vi.fn() };
const mockUpdate = { mutateAsync: vi.fn() };

// --------------------
// Render helper
// --------------------
const renderModal = (props: Partial<React.ComponentProps<typeof UserFormModal>> = {}) => {
  render(<UserFormModal isOpen={true} onClose={vi.fn()} mode="create" {...props} />);
};

// --------------------
// Tests
// --------------------
describe('UserFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRoles.mockReturnValue({ data: mockRoles, isLoading: false });
    mockUseCreateUser.mockReturnValue(mockCreate);
    mockUseUpdateUser.mockReturnValue(mockUpdate);
  });

  it('renders create modal correctly', async () => {
    renderModal({ mode: 'create' });

    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getByTestId('first-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('last-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('roleId-input')).toBeInTheDocument();
    expect(screen.getByLabelText(/Active User/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create User/i })).toBeInTheDocument();
  });

  it('renders edit modal with prefilled values', async () => {
    renderModal({ mode: 'edit', user: mockUser });

    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.firstName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.lastName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument();
  });

  it('calls create mutation when submitting create form', async () => {
    renderModal({ mode: 'create' });

    await userEvent.type(screen.getByTestId('first-name-input'), 'Alice');
    await userEvent.type(screen.getByTestId('last-name-input'), 'Smith');
    await userEvent.type(screen.getByTestId('email-input'), 'alice@example.com');

    // Select role
    await userEvent.selectOptions(screen.getByTestId('roleId-input'), 'role2');

    // Submit
    const submitButton = screen.getByRole('button', { name: /Create User/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate.mutateAsync).toHaveBeenCalledWith({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        roleId: 'role2',
        isActive: true,
      });
    });
  });

  it('calls update mutation when submitting edit form', async () => {
    renderModal({ mode: 'edit', user: mockUser });

    await userEvent.clear(screen.getByTestId('first-name-input'));
    await userEvent.type(screen.getByTestId('first-name-input'), 'Johnny');

    const submitButton = screen.getByRole('button', { name: /Update User/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdate.mutateAsync).toHaveBeenCalledWith({
        id: mockUser.id,
        data: {
          firstName: 'Johnny',
          lastName: mockUser.lastName,
          email: mockUser.email,
          roleId: mockUser.roleId._id,
          isActive: mockUser.isActive,
        },
      });
    });
  });

  it('calls onClose when cancel button is clicked', async () => {
    const onClose = vi.fn();
    renderModal({ onClose });

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});
