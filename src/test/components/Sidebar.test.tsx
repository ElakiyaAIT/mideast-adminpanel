import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../../components/layout';

// --------------------
// Mocks
// --------------------
vi.mock('../../utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

// --------------------
// Render helper
// --------------------
const renderSidebar = (initialPath = '/dashboard'): void => {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar />
    </MemoryRouter>,
  );
};

// --------------------
// Tests
// --------------------
describe('<Sidebar />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all desktop navigation links', () => {
    renderSidebar();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Equipment Categories')).toBeInTheDocument();
    expect(screen.getByText('Auctions')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
  });

  it('highlights active route correctly', () => {
    renderSidebar('/users');

    const usersLink = screen.getByText('Users').closest('a');
    expect(usersLink).toHaveClass('text-primary-700');
  });

  it('toggles mobile menu open and close', () => {
    renderSidebar();

    const toggleButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(toggleButton);

    // Mobile menu overlay should appear
    expect(screen.getByLabelText('Mobile sidebar navigation')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);

    // Mobile menu should disappear
    expect(screen.queryByLabelText('Mobile sidebar navigation')).not.toBeInTheDocument();
  });

  it('closes mobile menu when clicking a link', () => {
    renderSidebar();

    const toggleButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(toggleButton);

    const mobileMenu = screen.getByLabelText('Mobile sidebar navigation');

    const link = within(mobileMenu).getByText('Auctions').closest('a');
    expect(link).toBeInTheDocument();

    fireEvent.click(link!);
    expect(mobileMenu).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Mobile sidebar navigation')).not.toBeInTheDocument();
  });

  it('renders mobile header brand correctly', () => {
    renderSidebar();

    const brands = screen.getAllByText('Admin Panel');
    expect(brands.length).toBeGreaterThan(0);

    const badges = screen.getAllByText('A');
    expect(badges.length).toBeGreaterThan(1); //
  });
});
