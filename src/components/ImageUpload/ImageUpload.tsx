import { useState, useRef, type ChangeEvent, type JSX } from 'react';
import { cn } from '../../utils';
import { Upload, X, AlertCircle } from 'lucide-react';
import React from 'react';
// import { Button } from '../Button';

interface ImagePreview {
  file: File;
  url: string;
}

interface ImageUploadProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxFiles?: number;
  value?: string[]; // Existing image URLs
  onChange?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  label,
  error,
  helperText,
  required,
  maxFiles = 10,
  value = [],
  onChange,
  onRemove,
  disabled,
}: ImageUploadProps): JSX.Element => {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasError = Boolean(error);
  const totalImages = value.length + previews.length;
  const canAddMore = totalImages < maxFiles;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    handleFiles(Array.from(files));
  };

  const handleFiles = (files: File[]): void => {
    const remainingSlots = maxFiles - totalImages;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPreviews: ImagePreview[] = [];

    filesToAdd.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newPreviews.push({ file, url });
      }
    });

    if (newPreviews.length > 0) {
      setPreviews((prev) => [...prev, ...newPreviews]);
      const allFiles = [...previews, ...newPreviews].map((p) => p.file);
      onChange?.(allFiles);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || !canAddMore) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleRemovePreview = (index: number): void => {
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke URL to free memory
      URL.revokeObjectURL(prev[index].url);
      // Update parent with new file list
      const allFiles = newPreviews.map((p) => p.file);
      onChange?.(allFiles);
      return newPreviews;
    });
  };

  const handleRemoveExisting = (index: number): void => {
    onRemove?.(index);
  };

  const handleClick = (): void => {
    if (!disabled && canAddMore) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Drop Zone */}
      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed p-6 transition-all duration-300',
          'glass-light',
          dragActive
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
            : hasError
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600',
          !disabled &&
            canAddMore &&
            'cursor-pointer hover:border-primary-400 hover:bg-primary-50/30',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || !canAddMore}
          className="hidden"
          data-testId="images-input"
        />

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              'bg-primary-100 dark:bg-primary-900/50',
            )}
          >
            <Upload className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {canAddMore
                ? 'Click to upload or drag and drop'
                : `Maximum ${maxFiles} images reached`}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF, WEBP up to 10MB each
            </p>
          </div>

          {canAddMore && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {totalImages} / {maxFiles} images
            </p>
          )}
        </div>
      </div>

      {/* Image Previews */}
      {(value.length > 0 || previews.length > 0) && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {/* Existing images */}
          {value.map((url, index) => (
            <div key={`existing-${index}`} className="group relative">
              <div className="glass-light overflow-hidden rounded-xl border border-white/30 dark:border-white/10">
                <img src={url} alt={`Existing ${index + 1}`} className="h-32 w-full object-cover" />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(index)}
                  className={cn(
                    'absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white',
                    'opacity-0 transition-opacity group-hover:opacity-100',
                    'hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                  )}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}

          {/* New preview images */}
          {previews.map((preview, index) => (
            <div key={`preview-${index}`} className="group relative">
              <div className="glass-light overflow-hidden rounded-xl border border-primary-300 dark:border-primary-700">
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-full object-cover"
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemovePreview(index)}
                  className={cn(
                    'absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white',
                    'opacity-0 transition-opacity group-hover:opacity-100',
                    'hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                  )}
                  aria-label="Remove preview"
                >
                  <X size={14} />
                </button>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
                <p className="truncate text-xs text-white">{preview.file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper / Error text */}
      {helperText && !hasError && (
        <div className="mt-2 flex items-start gap-1 text-sm text-gray-500 dark:text-gray-400">
          <span>{helperText}</span>
        </div>
      )}

      {hasError && (
        <div className="mt-2 flex items-start gap-1 text-sm text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
