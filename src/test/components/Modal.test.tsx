import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Modal } from '../../components/Modal/Modal';

describe('Modal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={onClose}>
        Content
      </Modal>,
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders content when open (portal)', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        Portal Content
      </Modal>,
    );

    // IMPORTANT: query document.body since portal renders there
    expect(document.body).toHaveTextContent('Portal Content');
  });

  it('locks body scroll when open', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores scroll when closed', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    );

    rerender(
      <Modal isOpen={false} onClose={onClose}>
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape key', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when backdrop clicked', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    );

    const backdrop = document.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when close button clicked', () => {
    render(
      <Modal isOpen={true} onClose={onClose} showCloseButton>
        Content
      </Modal>,
    );

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct size class', () => {
    render(
      <Modal isOpen={true} onClose={onClose} size="lg">
        Content
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.innerHTML).toContain('max-w-2xl');
  });

  it('cleans overflow on unmount', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });
});
