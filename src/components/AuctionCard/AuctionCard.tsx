import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../utils';
import type { JSX } from 'react';

interface AuctionCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'UPCOMING' | 'PAST';
  images: string[];
  onProxibidClick?: () => void;
  onEquipmentFactsClick?: () => void;
}

export const AuctionCard = ({
  title,
  description,
  date,
  time,
  location,
  status,
  images,
  onProxibidClick,
  onEquipmentFactsClick,
}: AuctionCardProps): JSX.Element => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Status Badge */}
      <div className="relative">
        <div className="absolute right-3 top-3 z-10">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold text-white',
              status === 'UPCOMING' ? '' : 'bg-gray-500',
            )}
            style={status === 'UPCOMING' ? { backgroundColor: '#FDAD3E' } : {}}
          >
            {status}
          </span>
        </div>

        {/* Image Grid */}
        <div className="grid h-48 grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-700">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-600"
            >
              {image ? (
                <img
                  src={image}
                  alt={`${title} view ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">{title}</h3>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button
            variant="primary"
            size="sm"
            onClick={onProxibidClick}
            className="flex-1 text-xs font-bold text-white"
            style={{ backgroundColor: '#FDAD3E' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e89c2a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FDAD3E';
            }}
          >
            PROXIBID BIDDING
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onEquipmentFactsClick}
            className="flex-1 text-xs font-bold text-white"
            style={{ backgroundColor: '#FDAD3E' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e89c2a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FDAD3E';
            }}
          >
            EQUIPMENTFACTS BIDDING
          </Button>
        </div>
      </div>
    </div>
  );
};
