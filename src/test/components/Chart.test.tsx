import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chart } from '../../components/Chart/Chart';

describe('Chart Component', () => {
  it('renders children correctly', () => {
    render(
      <Chart>
        <div>Chart Content</div>
      </Chart>,
    );

    expect(screen.getByText('Chart Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Chart title="Revenue">
        <div>Content</div>
      </Chart>,
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Chart description="Monthly revenue stats">
        <div>Content</div>
      </Chart>,
    );

    expect(screen.getByText('Monthly revenue stats')).toBeInTheDocument();
  });

  it('renders headerAction when provided', () => {
    render(
      <Chart headerAction={<button>Export</button>}>
        <div>Content</div>
      </Chart>,
    );

    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('does not render header section when no title, description, or headerAction', () => {
    const { container } = render(
      <Chart>
        <div>Only Content</div>
      </Chart>,
    );

    // Header wrapper shouldn't exist
    expect(container.querySelector('.mb-6')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Chart className="custom-class">
        <div>Content</div>
      </Chart>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
