import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../../components/Card/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);

    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Card Title">Content</Card>);

    expect(screen.getByRole('heading', { name: /Card Title/i })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Card title="Title" description="Card Description">
        Content
      </Card>,
    );

    expect(screen.getByText('Card Description')).toBeInTheDocument();
  });

  it('renders headerAction when provided', () => {
    render(
      <Card title="Title" headerAction={<button>Action</button>}>
        Content
      </Card>,
    );

    expect(screen.getByRole('button', { name: /Action/i })).toBeInTheDocument();
  });

  it('does not render header section when no title, description, or headerAction provided', () => {
    const { container } = render(<Card>Only Content</Card>);

    // There should be no heading
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();

    // Optional: ensure only one wrapper div (content only case)
    expect(container.querySelector('h3')).toBeNull();
  });

  it('merges custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);

    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('custom-class');
  });
});
