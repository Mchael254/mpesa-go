export interface Pagination<T> {
  content: T[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort?: any;
  first: boolean;
  numberOfElements: number;
}

export interface Pageable {
  page: number;
  size: number;
}
