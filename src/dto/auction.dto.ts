// Auction Management DTOs

// ============================================
// ENUMS
// ============================================

export const AuctionStatusType = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  ENDED: 'ended',
  CANCELLED: 'cancelled',
} as const;

export const AuctionTypeType = {
  ONLINE: 'online',
  LIVE: 'live',
  TIMED: 'timed',
} as const;

export const BidStatusType = {
  ACTIVE: 'active',
  OUTBID: 'outbid',
  WINNING: 'winning',
  WON: 'won',
  LOST: 'lost',
} as const;

export type AuctionStatus = (typeof AuctionStatusType)[keyof typeof AuctionStatusType];
export type AuctionType = (typeof AuctionTypeType)[keyof typeof AuctionTypeType];
export type BidStatus = (typeof BidStatusType)[keyof typeof BidStatusType];

// ============================================
// AUCTION DTOs
// ============================================

export interface AuctionLocationDto {
  address?: string;
  city?: string;
  state?: string;
}

export interface ExternalPlatformDto {
  proxibidId?: string;
  equipmentfactsId?: string;
  proxibidUrl?: string;
  equipmentfactsUrl?: string;
}

export interface AuctionDto {
  _id: string;
  title: string;
  description: string;
  type: AuctionType;
  status: AuctionStatus;
  startDate: string;
  endDate: string;
  location?: AuctionLocationDto;
  externalPlatform?: ExternalPlatformDto;
  images?: string[];
  documents?: { name: string; url: string }[];
  equipmentCount: number;
  totalBids: number;
  highestBid?: number;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateAuctionDto {
  title: string;
  description: string;
  type: AuctionType;
  startDate: string;
  endDate: string;
  location?: AuctionLocationDto;
  externalPlatform?: ExternalPlatformDto;
  images?: string[];
  documents?: { name: string; url: string }[];
}

export interface UpdateAuctionDto {
  title?: string;
  description?: string;
  type?: AuctionType;
  startDate?: string;
  endDate?: string;
  location?: AuctionLocationDto;
  externalPlatform?: ExternalPlatformDto;
  images?: string[];
  documents?: { name: string; url: string }[];
}

export interface AssignEquipmentDto {
  equipmentIds: string[];
}

export interface FilterAuctionDto {
  page?: number;
  limit?: number;
  status?: AuctionStatus;
  type?: AuctionType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// ============================================
// BID DTOs
// ============================================

export interface BidDto {
  _id: string;
  auctionId: string;
  equipmentId: string;
  bidderId?: string;
  bidder?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  status: BidStatus;
  externalBidId?: string;
  externalBidder?: {
    name: string;
    paddleNumber?: string;
    platform: string;
  };
  isWinning: boolean;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
}
