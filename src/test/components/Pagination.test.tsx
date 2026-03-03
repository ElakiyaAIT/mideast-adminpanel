import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../components/Pagination/Pagination';
import type React from 'react';

/**
 * Mock Button to behave like native button
 */
vi.mock('../Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('Pagination', () => {
  const onPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render if totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders all pages if totalPages <= maxVisiblePages', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders ellipsis when pages exceed maxVisiblePages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('calls onPageChange when page number clicked', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables current page button', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    const currentButton = screen.getByText('2');
    expect(currentButton).toBeDisabled();
  });

  it('calls next button correctly', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls previous button correctly', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const buttons = screen.getAllByRole('button');
    const previousButton = buttons.find((btn) => btn.textContent?.includes('Previous'));

    expect(previousButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons.find((btn) => btn.textContent?.includes('Next'));

    expect(nextButton).toBeDisabled();
  });

  it('renders First and Last buttons when showFirstLast is true', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} showFirstLast />);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Last')).toBeInTheDocument();
  });

  it('does not render First and Last when showFirstLast is false', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
        showFirstLast={false}
      />,
    );

    expect(screen.queryByText('First')).not.toBeInTheDocument();
    expect(screen.queryByText('Last')).not.toBeInTheDocument();
  });

  it('calls First button correctly', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} showFirstLast />);

    fireEvent.click(screen.getByText('First'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls Last button correctly', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} showFirstLast />);

    fireEvent.click(screen.getByText('Last'));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });
  it('adjusts endPage when currentPage is near the start', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        maxVisiblePages={5}
        onPageChange={onPageChange}
      />,
    );

    // Should show first 5 pages
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
