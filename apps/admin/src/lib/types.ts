export type CollectionWithPagination<T> = {
  data: T[];
  total: number;
  currentPage: number;
};
