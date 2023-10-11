import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {SubjectAreaCategory} from "../../../shared/data/reports/subject-area-category";
import {Report} from "../../../shared/data/reports/report";
import {TableDetail} from "../../../shared/data/table-detail";
import {ChartReports} from "../../../shared/data/reports/chart-reports";
import {Pagination} from "../../../shared/data/common/pagination";
import {Dashboard, DashboardReport, DashboardReports} from "../../../shared/data/reports/dashboard";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });


  getSubjectAreas(): Observable<SubjectArea[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<SubjectArea[]>(`/${baseUrl}/chart/charts/subject-areas`);
  }

  getCategoriesBySubjectAreaId(id: number): Observable<SubjectAreaCategory[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<SubjectAreaCategory[]>(`/${baseUrl}/chart/charts/categories/${id}`);
  }

  getReports(): Observable<Report[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<Report[]>(`/${baseUrl}/chart/charts`);
  }

  /*getReportsByFolderId(): Observable<Report[]> {
    return null;
  }*/

  getReport(id: number): Observable<Report> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<Report>(`/${baseUrl}/chart/charts/${id}`);
  }

  saveReport(report: Report): Observable<Report> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.post<Report>(
      `/${baseUrl}/chart/charts`, JSON.stringify(report), {headers: this.headers});
  }

  editReport(id: number, report: Report): Observable<Report> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.put<Report>(
      `/${baseUrl}/chart/charts/${id}`, JSON.stringify(report), { headers: this.headers }
    );
  }

  deleteReport(reportId: number): Observable<string> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.delete<string>(`/${baseUrl}/chart/charts/${reportId}`, {headers: this.headers});
  }

  // utils
  prepareTableData(reportLabels, reportData, dimensions, measures, criteria): TableDetail {
    const tableHead = [];
    const header = [...dimensions, ...measures];

    header.forEach((x) => {
      const query = x.split(".")[1];
      const headerName = criteria.filter((q) => q.query === query)[0]?.queryName;
      tableHead.push(headerName)
    });

    const tableRows = []; // always initialize table to empty array before populating
    const elementLength = reportLabels[0]?.length;
    let enhancedChartLabels = [];

    for (let i=0; i < elementLength; i++) {
      const arr = [];
      reportLabels.forEach((item, j) => {
        arr.push(item[i]);
      });
      enhancedChartLabels.push(arr);
    }

    let tableData = [...enhancedChartLabels];
    reportData.forEach((x) => tableData.push(x));

    const dataLength = tableData[0]?.length;

    for(let i = 0; i < dataLength; i++) {
      const rowData = [];
      for (let j = 0; j < tableData.length; j++) {
        rowData.push(tableData[j][i]);
      }
      tableRows.push(rowData);
    }

    const cols = [], rows = [];

    tableHead.forEach((el, i) => {
      const field = el?.replace(/\s/g, ""); // remove whitespaces from field name
      cols[i] =  { field, header: el };
    });

    tableRows.forEach((row, i) => {
      let rowItem = {};
      cols.forEach((col, j) => {
        const fieldValue = typeof row[j] === 'number' ? (Math.round(row[j] * 100) / 100).toFixed(2) : row[j];
        rowItem[cols[j].field] = fieldValue;
      });
      rows.push(rowItem);
    });

    const tableDetails: TableDetail = {
      cols,
      rows,
      globalFilterFields: [],
      showFilter: false,
      showSorting: false,
      showSearch: false,
      title: '',
      paginator: true,
      url: '',
      urlIdentifier: ''
    }

    return tableDetails;
  }

  generateReportDatasets(reportLabels, reportData, measures) {
    let datasets = [];
    for (let i = 0; i < reportData.length; i++) {
      const dataset = {
        data: reportData[i],
        label: measures[i].split(".")[1]
      };
      datasets.push(dataset);
    }
    return datasets;
  }

  getChartReports(): Observable<Pagination<ChartReports[]>> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<Pagination<ChartReports[]>>(`/${baseUrl}/chart/chart-reports`);
  }

  /*Create a new dashboard*/
  saveDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.post<Dashboard>(
      `/${baseUrl}/chart/dashboards`, JSON.stringify(dashboard), {headers: this.headers});
  }

  getDashboards(): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<any>(`/${baseUrl}/chart/dashboards`);
  }

  getDashboardsById(id:number): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<any>(`/${baseUrl}/chart/dashboards/${id}`);
  }

  deleteDashboard(dashboardId: number): Observable<string> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.delete<string>(`/${baseUrl}/chart/dashboards/${dashboardId}`, {headers: this.headers});
  }

  addReportToDashboard(dashboardId: number, dashboardReport: DashboardReport): Observable<DashboardReports> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.post<DashboardReports>(
      `/${baseUrl}/chart/dashboards/${dashboardId}/reports`, JSON.stringify(dashboardReport), {headers: this.headers});
  }

  deleteReportFromDashboard(dashboardId: number, dashboardReport: DashboardReport): Observable<DashboardReports> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.delete<DashboardReports>(
      `/${baseUrl}/chart/dashboards/${dashboardId}/reports`, {headers: this.headers});
  }
}
