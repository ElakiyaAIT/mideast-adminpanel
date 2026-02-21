import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { auctionApi } from '../../api';
import type {
  AuctionDto,
  CreateAuctionDto,
  UpdateAuctionDto,
  FilterAuctionDto,
  AssignEquipmentDto,
  BidDto,
  EquipmentDto,
  PaginatedResponseDto,
  ApiResponse,
} from '../../dto';

/**
 * Hook to fetch auctions with filters
 */
export const useAuctions = (
  filters?: FilterAuctionDto,
): UseQueryResult<PaginatedResponseDto<AuctionDto>> => {
  return useQuery<PaginatedResponseDto<AuctionDto>>({
    queryKey: ['auctions', filters],
    queryFn: async () => {
      const response = await auctionApi.getAuctions(filters);
      return response;
    },
  });
};

/**
 * Hook to fetch a single auction by ID
 */
export const useAuction = (id: string) => {
  return useQuery<PaginatedResponseDto<AuctionDto>>({
    queryKey: ['auction', id],
    queryFn: () => auctionApi.getAuction(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch auction equipment
 */
export const useAuctionEquipment = (auctionId: string) => {
  return useQuery<ApiResponse<EquipmentDto[]>>({
    queryKey: ['auction', auctionId, 'equipment'],
    queryFn: () => auctionApi.getAuctionEquipment(auctionId),
    enabled: !!auctionId,
  });
};

/**
 * Hook to fetch auction bids
 */
export const useAuctionBids = (auctionId: string) => {
  return useQuery<ApiResponse<BidDto[]>>({
    queryKey: ['auction', auctionId, 'bids'],
    queryFn: () => auctionApi.getAuctionBids(auctionId),
    enabled: !!auctionId,
  });
};

/**
 * Hook to create a new auction
 */
export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuctionDto) => auctionApi.createAuction(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auctions'] });
      // console.log('Auction created successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to create auction');
    },
  });
};

/**
 * Hook to update an auction
 */
export const useUpdateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuctionDto }) =>
      auctionApi.updateAuction(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['auctions'] });
      void queryClient.invalidateQueries({ queryKey: ['auction', variables.id] });
      // console.log('Auction updated successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to update auction');
    },
  });
};

/**
 * Hook to assign equipment to an auction
 */
export const useAssignEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignEquipmentDto }) =>
      auctionApi.assignEquipment(id, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['auction', variables.id, 'equipment'] });
      void queryClient.invalidateQueries({ queryKey: ['auction', variables.id] });
      // console.log('Equipment assigned successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to assign equipment');
    },
  });
};

/**
 * Hook to cancel an auction
 */
export const useCancelAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => auctionApi.cancelAuction(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ['auctions'] });
      void queryClient.invalidateQueries({ queryKey: ['auction', id] });
      // console.log('Auction cancelled successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to cancel auction');
    },
  });
};

/**
 * Hook to delete an auction
 */
export const useDeleteAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => auctionApi.deleteAuction(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auctions'] });
      // console.log('Auction deleted successfully');
    },
    onError: (error: Error) => {
      console.error(error.message || 'Failed to delete auction');
    },
  });
};
