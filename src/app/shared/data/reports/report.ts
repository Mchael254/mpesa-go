import {Criteria} from "./criteria";

export interface Report {
  id?: number;
  backgroundColor?: string;
  borderColor?: string;
  dashboardId: number;
  folderId: number;
  reportDescription: string;
  reportName: string;
  reportType: string;
  userId: number;
  criteria?: string | Criteria[];
  active?: boolean;
}

export interface ReportV2 {
  charts: Chart[],
  createdBy?: number,
  createdDate: string,
  dashboardId: number,
  dimensions: string,
  filter?: string,
  sort?: string,
  folder: string, // M | S
  id?: number,
  length?: number,
  measures: string /*Measure[]*/,
  name: string,
  order?: number,
  width?: number
}

export interface Chart {
  backgroundColor: string,
  borderColor: string,
  chartReportId: number,
  colorScheme: number,
  evenColor: string,
  evenOddAppliesTo: string,
  id: number,
  length: number,
  name: string,
  oddColor: string,
  order: number,
  type: string,
  width: number
}

interface Measure {
  category: string,
  categoryName: string,
  subcategory: string,
  subCategoryName: string,
  transaction: string,
  query: string,
  queryName: string
}
