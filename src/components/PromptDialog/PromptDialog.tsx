import { useState, type JSX, type FormEvent } from 'react';
import { Modal, Button, Input } from '../';
import { MessageSquare } from 'lucide-react';

interface PromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  multiline?: boolean;
  minlength?: number;
}

export const PromptDialog = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  placeholder = 'Enter text...',
  confirmText = 'Submit',
  cancelText = 'Cancel',
  isLoading = false,
  multiline = false,
  minlength,
}: PromptDialogProps): JSX.Element => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    const trimmed = value.trim();
    if (minlength && trimmed.length < minlength) {
      setError(`Enter atleast ${minlength} characters`);
      return;
    }

    if (value.trim()) {
      onSubmit(value);
      setValue('');
      onClose();
    }
  };

  const handleClose = (): void => {
    setValue('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{message}</p>
            {multiline ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                rows={3}
                placeholder={placeholder}
                required
                autoFocus
              />
            ) : (
              <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                required
                autoFocus
              />
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={isLoading || !value.trim()}>
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
