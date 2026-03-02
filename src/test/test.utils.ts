import type { PaginatedResponseDto } from '../dto';

export const CreatePaginatedResponse = <T>(
  items: T[] = [],
  overrides?: Partial<PaginatedResponseDto<T>>,
): PaginatedResponseDto<T> => {
  return {
    items,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
      ...overrides?.pagination,
    },
    ...overrides,
  };
};
