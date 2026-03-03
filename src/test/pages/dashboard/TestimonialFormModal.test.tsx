import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { testimonialApi } from '../../../api/testimonialApi';
import { useCreateTestimonial, useUpdateTestimonial } from '../../../hooks/queries/useTestimonial';
import TestimonialFormModal from '../../../pages/dashboard/components/TestimonialFormModal';

// Mock API and hooks
vi.mock('../../../hooks/queries/useTestimonial');
vi.mock('../../../api/testimonialApi');

describe('TestimonialFormModal', () => {
  const mockOnClose = vi.fn();
  const mockTestimonial = {
    _id: '123',
    name: 'John Doe',
    role: 'CEO',
    review: 'Great service!',
    image: 'https://example.com/image.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUseCreateTestimonial = useCreateTestimonial as unknown as ReturnType<typeof vi.fn>;
    const mockUseUpdateTestimonial = useUpdateTestimonial as unknown as ReturnType<typeof vi.fn>;
    const mockUploadImage = testimonialApi.uploadImage as unknown as ReturnType<typeof vi.fn>;

    mockUseCreateTestimonial.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });

    mockUseUpdateTestimonial.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });

    // Mock API function
    mockUploadImage.mockResolvedValue({
      data: { url: 'https://example.com/new-image.jpg' },
    });
  });

  it('renders correctly in create mode', () => {
    render(<TestimonialFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('designation-input')).toBeInTheDocument();
    expect(screen.getByTestId('review-input')).toBeInTheDocument();
    expect(screen.getByText(/Create Testimonial/i)).toBeInTheDocument();
  });

  it('renders correctly in edit mode with existing data', async () => {
    render(
      <TestimonialFormModal
        isOpen={true}
        onClose={mockOnClose}
        mode="edit"
        testimonial={mockTestimonial}
      />,
    );

    // Wait for inputs to have the correct values
    const nameInput = (await screen.findByTestId('name-input')) as HTMLInputElement;
    const roleInput = (await screen.findByTestId('designation-input')) as HTMLInputElement;
    const reviewInput = (await screen.findByTestId('review-input')) as HTMLTextAreaElement;

    expect(nameInput.value).toBe(mockTestimonial.name);
    expect(roleInput.value).toBe(mockTestimonial.role);
    expect(reviewInput.value).toBe(mockTestimonial.review);

    // Check the submit button text
    expect(screen.getByText(/Update Testimonial/i)).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    render(<TestimonialFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

    const nameInput = screen.getByTestId('name-input');
    const roleInput = screen.getByTestId('designation-input');
    const reviewInput = screen.getByTestId('review-input');

    await userEvent.type(nameInput, 'Alice');
    await userEvent.type(roleInput, 'Manager');
    await userEvent.type(reviewInput, 'Awesome work!');

    expect(nameInput).toHaveValue('Alice');
    expect(roleInput).toHaveValue('Manager');
    expect(reviewInput).toHaveValue('Awesome work!');
  });

  it('handles image upload', async () => {
    render(<TestimonialFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('images-input') as HTMLInputElement;

    await userEvent.upload(input, file);

    // The ImageUpload component renders a preview with file name
    expect(await screen.findByText('test.png')).toBeInTheDocument();

    // Optional: check that the remove button exists
    expect(screen.getByLabelText('Remove preview')).toBeInTheDocument();
  });

  it('submits create form', async () => {
    const mockUseCreateTestimonial = useCreateTestimonial as unknown as ReturnType<typeof vi.fn>;

    const createMutation = {
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    };
    mockUseCreateTestimonial.mockReturnValue(createMutation);

    render(<TestimonialFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

    await userEvent.type(screen.getByTestId('name-input'), 'Alice');
    await userEvent.type(screen.getByTestId('designation-input'), 'CEO'); // <-- important
    await userEvent.type(screen.getByTestId('review-input'), 'Great service!');

    await userEvent.click(screen.getByRole('button', { name: /Create Testimonial/i }));
    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice',
          review: 'Great service!',
        }),
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // it('submits edit form', async () => {
  //   const updateMutation = {
  //     mutateAsync: vi.fn().mockResolvedValue({}),
  //     isPending: false,
  //   };
  //   const mockUseUpdateTestimonial = useUpdateTestimonial as unknown as ReturnType<typeof vi.fn>;

  //   mockUseUpdateTestimonial.mockReturnValue(updateMutation);

  //   render(
  //     <TestimonialFormModal
  //       isOpen={true}
  //       onClose={mockOnClose}
  //       mode="edit"
  //       testimonial={mockTestimonial}
  //     />,
  //   );

  //   fireEvent.click(screen.getByRole('button', { name: /Update Testimonial/i }));

  //   await waitFor(() => {
  //     const expectedArg: Parameters<typeof updateMutation.mutateAsync>[0] = {
  //       id: mockTestimonial._id,
  //       data: {
  //         name: mockTestimonial.name,
  //         review: mockTestimonial.review,
  //         image: mockTestimonial.image,
  //       },
  //     };
  //     expect(updateMutation.mutateAsync).toHaveBeenCalledWith(expectedArg);
  //     expect(mockOnClose).toHaveBeenCalled();
  //   });
  // });

  it('closes modal on cancel', () => {
    render(<TestimonialFormModal isOpen={true} onClose={mockOnClose} mode="create" />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
