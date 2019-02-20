export interface PagedResults<T> {
  virtualCount: number;
  results: T[];
  filter: any;
  sort: any;
}
