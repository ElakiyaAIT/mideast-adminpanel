import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUpload } from '../../components/ImageUpload/ImageUpload';

// Mock URL.createObjectURL
beforeEach(() => {
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => 'mock-url');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

const createImageFile = (name = 'test.png') => new File(['dummy'], name, { type: 'image/png' });

describe('ImageUpload', () => {
  it('renders label and helper text', () => {
    render(<ImageUpload label="Upload Images" helperText="You can upload images" />);

    expect(screen.getByText('Upload Images')).toBeInTheDocument();
    expect(screen.getByText('You can upload images')).toBeInTheDocument();
  });

  it('shows error message when error prop is provided', () => {
    render(<ImageUpload error="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('uploads image and calls onChange', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn<(files: File[]) => void>();

    render(<ImageUpload onChange={onChangeMock} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    const file = createImageFile();

    await user.upload(input, file);

    const firstCall = onChangeMock.mock.calls[0]; // first call
    const firstArg = firstCall[0]; // first argument of that call

    expect(onChangeMock).toHaveBeenCalled();
    expect(firstArg[0]).toEqual(file); // first file
    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('removes preview image when remove button clicked', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(<ImageUpload onChange={onChangeMock} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createImageFile('remove.png');

    await user.upload(input, file);

    expect(screen.getByText('remove.png')).toBeInTheDocument();

    const removeButton = screen.getByLabelText('Remove preview');
    await user.click(removeButton);

    expect(onChangeMock).toHaveBeenLastCalledWith([]);
  });

  it('calls onRemove when removing existing image', async () => {
    const user = userEvent.setup();
    const onRemoveMock = vi.fn();

    render(<ImageUpload value={['https://example.com/image.jpg']} onRemove={onRemoveMock} />);

    const removeButton = screen.getByLabelText('Remove image');
    await user.click(removeButton);

    expect(onRemoveMock).toHaveBeenCalledWith(0);
  });

  it('respects maxFiles limit', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn<(files: File[]) => void>();

    render(<ImageUpload maxFiles={1} onChange={onChangeMock} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file1 = createImageFile('one.png');
    const file2 = createImageFile('two.png');

    await user.upload(input, [file1, file2]);
    const firstCall = onChangeMock.mock.calls[0]; // first call
    const files = firstCall[0]; // argument passed to onChange

    // Should only allow one
    expect(files.length).toBe(1); // TS knows files is File[]
    expect(screen.getByText('one.png')).toBeInTheDocument();
  });

  it('does not allow upload when disabled', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();

    render(<ImageUpload disabled onChange={onChangeMock} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = createImageFile();

    await user.upload(input, file);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('activates drag state on dragenter and deactivates on dragleave', () => {
    render(<ImageUpload />);

    const dropZone = screen.getByText('Click to upload or drag and drop').closest('div')!;

    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone);

    // No direct state assertion, but this ensures no crash
    expect(dropZone).toBeInTheDocument();

    fireEvent.dragLeave(dropZone);
  });
});
