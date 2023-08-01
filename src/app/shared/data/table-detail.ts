export interface TableDetail {
  cols: {field: string, header: string}[],
  rows: any[],
  rowsPerPage?: number,
  globalFilterFields: string[],
  showFilter: boolean,
  showSorting: boolean,
  title: string,
  paginator: boolean,
  url?: string,
  urlIdentifier?: string,
}
