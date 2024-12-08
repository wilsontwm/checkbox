export interface BaseFindPagedParams {
  page?: number;
  limit?: number;
  sort?: Record<string, 'asc' | 'desc'>;
}

export interface PaginationResult<T> {
  data: T[];
  hasMore?: boolean;
  total: number;
}
