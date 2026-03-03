import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuctionCard } from '../../components/AuctionCard/AuctionCard';

const baseProps = {
  title: 'Exciting Auction',
  description: 'This is a description of the auction item.',
  date: '2026-03-15',
  time: '14:00',
  location: 'New York, NY',
  status: 'UPCOMING' as const,
  images: [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/150',
  ],
  onProxibidClick: vi.fn(),
  onEquipmentFactsClick: vi.fn(),
};

describe('AuctionCard - full coverage', () => {
  it('renders all content correctly', () => {
    render(<AuctionCard {...baseProps} />);
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.description)).toBeInTheDocument();
    expect(screen.getByText(baseProps.date)).toBeInTheDocument();
    expect(screen.getByText(baseProps.time)).toBeInTheDocument();
    expect(screen.getByText(baseProps.location)).toBeInTheDocument();
  });

  it('renders images correctly', () => {
    render(<AuctionCard {...baseProps} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(3);
    imgs.forEach((img, index) => {
      expect(img).toHaveAttribute('src', baseProps.images[index]);
      expect(img).toHaveAttribute('alt', `${baseProps.title} view ${index + 1}`);
    });
  });

  it('displays UPCOMING status badge with correct color', () => {
    render(<AuctionCard {...baseProps} />);
    const badge = screen.getByText('UPCOMING');
    expect(badge).toHaveStyle({ backgroundColor: '#FDAD3E' });
  });

  it('displays PAST status badge with gray background', () => {
    render(<AuctionCard {...baseProps} status="PAST" />);
    const badge = screen.getByText('PAST');
    expect(badge).toHaveClass('bg-gray-500');
  });

  it('fires PROXIBID button click', () => {
    render(<AuctionCard {...baseProps} />);
    const proxibidBtn = screen.getByText(/PROXIBID BIDDING/i);
    fireEvent.click(proxibidBtn);
    expect(baseProps.onProxibidClick).toHaveBeenCalled();
  });

  it('fires EQUIPMENTFACTS button click', () => {
    render(<AuctionCard {...baseProps} />);
    const equipBtn = screen.getByText(/EQUIPMENTFACTS BIDDING/i);
    fireEvent.click(equipBtn);
    expect(baseProps.onEquipmentFactsClick).toHaveBeenCalled();
  });

  it('changes PROXIBID button background on hover', () => {
    render(<AuctionCard {...baseProps} />);
    const button = screen.getByText(/PROXIBID BIDDING/i);
    fireEvent.mouseEnter(button);
    expect(button).toHaveStyle({ backgroundColor: '#e89c2a' });
    fireEvent.mouseLeave(button);
    expect(button).toHaveStyle({ backgroundColor: '#FDAD3E' });
  });

  it('changes EQUIPMENTFACTS button background on hover', () => {
    render(<AuctionCard {...baseProps} />);
    const button = screen.getByText(/EQUIPMENTFACTS BIDDING/i);
    fireEvent.mouseEnter(button);
    expect(button).toHaveStyle({ backgroundColor: '#e89c2a' });
    fireEvent.mouseLeave(button);
    expect(button).toHaveStyle({ backgroundColor: '#FDAD3E' });
  });

  it('renders exactly 3 image slots even with fewer images', () => {
    const images = ['https://via.placeholder.com/150']; // only 1 real image
    render(<AuctionCard {...baseProps} images={images} />);
    const imgSlots = screen.getAllByRole('img');
    expect(imgSlots).toHaveLength(1); // only 1 <img>, the others are div placeholders
  });
});