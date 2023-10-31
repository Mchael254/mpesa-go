import {ReportV2} from "./report";

export interface CreateUpdateDashboardDTO {
  createdBy: number,
  dashboardReports: DashboardReports[],
  id?: number,
  name: string,
  organizationId: number,
  chartData?:any
}

export interface DashboardReports {
  length: number,
  order: number,
  reportId: number,
  width: number
}

export interface AddReportToDashDTO {
  dashboardId: number,
  dashboardReports: DashboardReports[],
}

export interface DashboardRes {
  id: number,
  createdBy: number,
  createdDate: string,
  name: string,
  reports: ReportV2[];
}

export interface ListDashboardsDTO {
  createdBy: number,
  createdDate: string,
  reports: ReportV2[],
  id?: number,
  organizationId: number,
  name: string,
}
