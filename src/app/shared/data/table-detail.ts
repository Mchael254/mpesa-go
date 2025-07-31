export interface TableDetail {
  cols?: {field: string, header: string}[],
  rows?: any[],
  rowsPerPage?: number,
  globalFilterFields?: string[],
  showFilter?: boolean,
  showSorting?: boolean,
  showSearch?: boolean,
  title?: string,
  paginator?: boolean,
  url?: string,
  urlIdentifier?: string,
  isLazyLoaded?: boolean,
  totalElements?: number,
  showCustomModalOnView?: boolean,
  noDataFoundMessage?: string,
  viewDetailsOnView?: boolean;
  viewMethod?: (rowId: any) => void;
}

export interface TableFieldLabel {
  en: string;
  ke: string;
  fr: string;
}

export interface TableFieldConfig {
  field: string;
  header: string;
  visible: boolean;
  label: TableFieldLabel;
}
