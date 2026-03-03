import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { EquipmentCategoryFormModal } from '../../../pages/dashboard/components/EquipmentCategoryFormModal';

// Mock external components if needed
vi.mock('../../../components/Modal/Modal', () => ({
  Modal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('EquipmentCategoryFormModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockCategory = {
    _id: '1',
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test description',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly in add mode', () => {
    render(
      <EquipmentCategoryFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isEditMode={false}
      />,
    );

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('slug-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('isActive-input')).toBeInTheDocument();
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it('renders correctly in edit mode with existing data', () => {
    render(
      <EquipmentCategoryFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isEditMode={true}
        selectedCategory={mockCategory}
        imageUrl="https://example.com/image.jpg"
      />,
    );

    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('description-input') as HTMLTextAreaElement;
    const activeCheckbox = screen.getByTestId('isActive-input') as HTMLInputElement;

    expect(nameInput.value).toBe(mockCategory.name);
    expect(descriptionInput.value).toBe(mockCategory.description);
    expect(activeCheckbox.checked).toBe(true);

    // Slug should NOT be rendered in edit mode
    expect(screen.queryByLabelText(/Slug/i)).toBeNull();

    // Image is rendered (Remove button exists)
    expect(screen.getByLabelText(/Remove image/i)).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    render(
      <EquipmentCategoryFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isEditMode={false}
      />,
    );

    const nameInput = screen.getByTestId('name-input');
    const slugInput = screen.getByTestId('slug-input');
    const descriptionInput = screen.getByTestId('description-input');
    const activeCheckbox = screen.getByTestId('isActive-input') as HTMLInputElement;

    await userEvent.type(nameInput, 'New Name');
    await userEvent.type(slugInput, 'new-slug');
    await userEvent.type(descriptionInput, 'New description');
    fireEvent.click(activeCheckbox); // toggle

    expect(nameInput).toHaveValue('New Name');
    expect(slugInput).toHaveValue('new-slug');
    expect(descriptionInput).toHaveValue('New description');
    expect(activeCheckbox.checked).toBe(false);
  });

  it('closes modal on cancel', () => {
    render(
      <EquipmentCategoryFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isEditMode={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
