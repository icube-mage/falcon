export type SortOrderDirection = 'asc' | 'desc';

export type FilterOperator = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'nin' | 'range';

export type SortOrder = {
  field: string;
  direction: SortOrderDirection;
  name?: string;
};

export type PaginationInput = {
  perPage: number;
  page: number;
};

export type FilterInput = {
  operator: FilterOperator;
  field: string;
  value: string[];
};

export type SearchState = {
  query?: string;
  filters?: FilterInput[];
  sort?: SortOrder;
  pagination?: PaginationInput;
};
