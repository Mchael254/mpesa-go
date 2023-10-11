import {ReportV2} from "./report";

export interface Dashboard {
  createdBy: number,
  dashboardReports: DashboardReports[],
  id?: number,
  name: string,
  chartData?:any
}

export interface DashboardReports {
  length: number,
  order: number,
  reportId: number,
  width: number
}

export interface DashboardReport {
  dashboardId: number,
  dashboardReports: DashboardReports[],
}

export interface ChartReport {
  createdBy: number,
  createdDate: string,
  reports: ReportV2[],
  id?: number,
  name: string,
}
