import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);

    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText('Default Badge');

    // default variant = primary
    expect(badge.className).toContain('from-primary-500');
    expect(badge.className).toContain('to-primary-600');

    // default size = md
    expect(badge.className).toContain('px-3');
    expect(badge.className).toContain('py-1');
    expect(badge.className).toContain('text-sm');
  });

  it('applies success variant styles', () => {
    render(<Badge variant="success">Success</Badge>);

    const badge = screen.getByText('Success');

    expect(badge.className).toContain('from-green-500');
    expect(badge.className).toContain('to-green-600');
  });

  it('applies danger variant styles', () => {
    render(<Badge variant="danger">Danger</Badge>);

    const badge = screen.getByText('Danger');

    expect(badge.className).toContain('from-red-500');
    expect(badge.className).toContain('to-red-600');
  });

  it('applies large size styles', () => {
    render(<Badge size="lg">Large</Badge>);

    const badge = screen.getByText('Large');

    expect(badge.className).toContain('px-4');
    expect(badge.className).toContain('py-1.5');
    expect(badge.className).toContain('text-base');
  });

  it('merges custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);

    const badge = screen.getByText('Custom');

    expect(badge.className).toContain('custom-class');
  });
});
