export interface ChartReports {
  id: number,
  dimensions: string | Dimensions[],
  measures: string | Measures[],
  filter: null,
  createdBy: number,
  dashboardId: null,
  createdDate: string,
  order: null,
  width: null,
  length: null,
  name: string,
  folder: string,
  charts: string | Charts[],
}
export interface Dimensions {
  category:string,
  categoryName:string,
  subcategory:string,
  subCategoryName:string,
  transaction:string,
  query:string,
  queryName:string
}

export interface Measures {
  category:string,
  categoryName:string,
  subcategory:string,
  subCategoryName:string,
  transaction:string,
  query:string,
  queryName:string
}

export interface Charts {
  id: number,
  name: string,
  type: string,
  borderColor: string,
  backgroundColor: string,
  evenColor: string,
  oddColor: string,
  evenOddAppliesTo: string,
  chartReportId: number,
  colorScheme: null,
  order: null,
  width: null,
  length: null
}
/*This DTO is used to rename Dashboards and Reports*/
export interface RenameDTO {
  dashboardId?: number,
  name: string,
  reportId?: number
}
