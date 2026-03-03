import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { equipmentApi } from '../../../api/equipmentApi';
import {
  useCreateEquipment,
  useUpdateEquipment,
  useEquipmentCategories,
  useUsersList,
} from '../../../hooks/queries';
import EquipmentFormModal from '../../../pages/dashboard/components/EquipmentFormModal';
import type { EquipmentDto } from '../../../dto';

vi.mock('../../../hooks/queries');
vi.mock('../../../api/equipmentApi');
// vi.mock('../../../components', async () => {
//   const actual = await vi.importActual('../../../components');
//   return {
//     ...actual,
//     Select: ({ value, onChange, options, 'data-testid': testId }: any) => (
//       <select
//         data-testid={testId}
//         value={value || ''}
//         onChange={(e) => {
//           const selectedOption = options.find((o: any) => o.value === e.target.value);
//           onChange(selectedOption?.value ?? '');
//         }}
//       >
//         {options?.map((opt: any) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     ),
//   };
// });

describe('EquipmentFormModal', () => {
  const mockOnClose = vi.fn();

  const mockEquipment: EquipmentDto = {
    _id: 'eq1',
    title: 'Old Excavator',
    description: 'Heavy machinery',
    categoryId: {
      _id: 'cat1',
      name: 'Excavator',
      slug: '',
      description: '',
      isActive: true,
      isDeleted: false,
      sortOrder: 1,
      createdAt: '',
      updatedAt: '',
    },
    sellerId: { _id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    listingType: 'buy_now',
    buyNowPrice: 50000,
    reservePrice: undefined,
    make: 'Caterpillar',
    models: '320D',
    year: 2018,
    serialNumber: 'SN1234',
    hoursUsed: 1200,
    condition: 'USED',
    location: { address: '123 Main St', city: 'NY', state: 'NY', zipCode: '10001', country: 'USA' },
    images: ['https://example.com/image1.jpg'],
    status: 'active',
    viewCount: 0,
    inquiryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    isFeatured: true,
    isPublished: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    const mockUseCreateEquipment = useCreateEquipment as unknown as ReturnType<typeof vi.fn>;
    const mockUseUpdateEquipment = useUpdateEquipment as unknown as ReturnType<typeof vi.fn>;
    const mockUseEquipmentCategories = useEquipmentCategories as unknown as ReturnType<
      typeof vi.fn
    >;
    const mockUseUsersList = useUsersList as unknown as ReturnType<typeof vi.fn>;
    const mockUploadImages = equipmentApi.uploadImages as unknown as ReturnType<typeof vi.fn>;

    mockUseCreateEquipment.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });

    mockUseUpdateEquipment.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });

    mockUseEquipmentCategories.mockReturnValue({
      data: { items: [{ _id: 'cat1', name: 'Excavators' }] },
    });

    mockUseUsersList.mockReturnValue({
      data: {
        items: [{ _id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }],
      },
    });

    mockUploadImages.mockResolvedValue({
      data: { urls: ['https://example.com/new-image.jpg'] },
    });
  });

  it('renders correctly in create mode', () => {
    render(<EquipmentFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('categoryId-input')).toBeInTheDocument();
    expect(screen.getByTestId('sellerId-input')).toBeInTheDocument();
    expect(screen.getByText(/Create Equipment/i)).toBeInTheDocument();
  });

  it('renders correctly in edit mode with existing data', async () => {
    render(
      <EquipmentFormModal
        isOpen={true}
        onClose={mockOnClose}
        mode="edit"
        equipment={mockEquipment}
      />,
    );

    const titleInput = (await screen.findByTestId('title-input')) as HTMLInputElement;
    const descriptionInput = (await screen.findByTestId(
      'description-input',
    )) as HTMLTextAreaElement;
    const makeInput = (await screen.findByTestId('make-input')) as HTMLInputElement;

    expect(titleInput.value).toBe(mockEquipment.title);
    expect(descriptionInput.value).toBe(mockEquipment.description);
    expect(makeInput.value).toBe(mockEquipment.make);

    expect(screen.getByText(/Update Equipment/i)).toBeInTheDocument();
  });

  it('updates form values when user types', async () => {
    render(<EquipmentFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

    await userEvent.type(screen.getByTestId('title-input'), 'New Excavator');
    await userEvent.type(screen.getByTestId('description-input'), 'Powerful machine');
    await userEvent.type(screen.getByTestId('make-input'), 'Caterpillar');

    expect(screen.getByTestId('title-input')).toHaveValue('New Excavator');
    expect(screen.getByTestId('description-input')).toHaveValue('Powerful machine');
    expect(screen.getByTestId('make-input')).toHaveValue('Caterpillar');
  });

  it('handles image upload', async () => {
    render(<EquipmentFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('images-input') as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(await screen.findByText('test.png')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove preview')).toBeInTheDocument();
  });

  //  it('submits create form successfully', async () => {
  //   const createMutation = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false };
  //   (useCreateEquipment as any).mockReturnValue(createMutation);

  //   (useEquipmentCategories as any).mockReturnValue({
  //     data: { items: [{ _id: 'cat1', name: 'Excavators' }] },
  //   });

  //   (useUsersList as any).mockReturnValue({
  //     data: {
  //       items: [{ id: 'user1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' }],
  //     },
  //   });

  //   render(<EquipmentFormModal isOpen={true} onClose={mockOnClose} mode="create" />);

  //   // Fill text inputs
  //   await userEvent.type(screen.getByTestId('title-input'), 'New Excavator');
  //   await userEvent.type(screen.getByTestId('description-input'), 'Powerful machine');
  //   await userEvent.type(screen.getByTestId('make-input'), 'Caterpillar');
  //   await userEvent.type(screen.getByTestId('models-input'), '320D');
  //   await userEvent.type(screen.getByTestId('year-input'), '2019');
  //   await userEvent.type(screen.getByTestId('hours-input'), '500');
  //   await userEvent.type(screen.getByTestId('buynow-input'), '75000');

  //   // Fill location fields
  //   await userEvent.type(screen.getByTestId('address-input'), '123 Main St');
  //   await userEvent.type(screen.getByTestId('city-input'), 'New York');
  //   await userEvent.type(screen.getByTestId('state-input'), 'NY');
  //   await userEvent.type(screen.getByTestId('zipcode-input'), '10001');
  //   await userEvent.type(screen.getByTestId('country-input'), 'USA');

  //   // Select dropdown values
  //   await userEvent.selectOptions(screen.getByTestId('categoryId-input'), 'cat1');
  //   await userEvent.selectOptions(screen.getByTestId('sellerId-input'), 'user1');
  //   await userEvent.selectOptions(screen.getByTestId('condition-input'), 'good');
  //   await userEvent.selectOptions(screen.getByTestId('listing-input'), 'buy_now');

  //   // Submit the form
  //   await userEvent.click(screen.getByRole('button', { name: /Create Equipment/i }));

  //   // Assert mutateAsync called with all fields
  //   await waitFor(() => {
  //     expect(createMutation.mutateAsync).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         title: 'New Excavator',
  //         description: 'Powerful machine',
  //         make: 'Caterpillar',
  //         models: '320D',
  //         year: '2019',
  //         hoursUsed: 500,
  //         buyNowPrice: 75000,
  //         categoryId: 'cat1',
  //         sellerId: 'user1',
  //         condition: 'good',
  //         listingType: 'buy_now',
  //         location: {
  //           address: '123 Main St',
  //           city: 'New York',
  //           state: 'NY',
  //           zipCode: '10001',
  //           country: 'USA',
  //         },
  //       })
  //     );
  //     expect(mockOnClose).toHaveBeenCalled();
  //   });

  // });

  //    it('submits edit form successfully', async () => {
  //     const updateMutation = { mutateAsync: vi.fn().mockResolvedValue({}), isPending: false };
  //     (useUpdateEquipment as any).mockReturnValue(updateMutation);

  //     render(<EquipmentFormModal isOpen={true} onClose={mockOnClose} mode="edit" equipment={mockEquipment} />);

  //     // Ensure all required fields are present
  //     fireEvent.change(screen.getByTestId('condition-input'), { target: { value: 'USED' } });
  //     fireEvent.change(screen.getByTestId('listing-input'), { target: { value: 'BUY_NOW' } });
  //     fireEvent.change(screen.getByTestId('buynow-input'), { target: { value: '50000' } });
  //     fireEvent.change(screen.getByTestId('hours-input'), { target: { value: '1200' } });

  // await userEvent.click(
  //   screen.getByRole('button', { name: /Update Equipment/i })
  // );
  //     await waitFor(() => {
  //       expect(updateMutation.mutateAsync).toHaveBeenCalledWith(expect.objectContaining({
  //         id: mockEquipment._id,
  //         data: expect.objectContaining({
  //           title: mockEquipment.title,
  //           description: mockEquipment.description,
  //           make: mockEquipment.make,
  //         }),
  //       }));
  //       expect(mockOnClose).toHaveBeenCalled();
  //     });
  //   });
  it('closes modal on cancel', () => {
    render(<EquipmentFormModal isOpen={true} onClose={mockOnClose} mode="create" />);
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
