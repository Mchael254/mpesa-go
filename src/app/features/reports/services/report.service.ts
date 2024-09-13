import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectArea } from '../../../shared/data/reports/subject-area';
import { SubjectAreaCategory } from '../../../shared/data/reports/subject-area-category';
import { Report } from '../../../shared/data/reports/report';
import { TableDetail } from '../../../shared/data/table-detail';
import {
  ChartReports,
  RenameDTO,
} from '../../../shared/data/reports/chart-reports';
import { Pagination } from '../../../shared/data/common/pagination';
import {
  CreateUpdateDashboardDTO,
  AddReportToDashDTO,
  DashboardReports,
} from '../../../shared/data/reports/dashboard';
import { Logger } from '../../../shared/services';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

const log = new Logger('ReportService');

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private apiService: ApiService
  ) {}

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  getSubjectAreas(): Observable<SubjectArea[]> {
    return this.apiService.GET<SubjectArea[]>(
      `charts/subject-areas`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  getCategoriesBySubjectAreaId(id: number): Observable<SubjectAreaCategory[]> {
    return this.apiService.GET<SubjectAreaCategory[]>(
      `charts/categories/${id}`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  getReports(): Observable<Report[]> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.get<Report[]>(`/${baseUrl}/chart/charts`);
    return this.apiService.GET<Report[]>(
      `charts`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  getReport(id: number): Observable<Report> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.get<Report>(`/${baseUrl}/chart/charts/${id}`);
    return this.apiService.GET<Report>(
      `charts/${id}`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  saveReport(report: Report): Observable<Report> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.post<Report>(
    //   `/${baseUrl}/chart/charts`,
    //   JSON.stringify(report),
    //   { headers: this.headers }
    // );
    return this.apiService.POST<Report>(
      `charts`,
      JSON.stringify(report),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  editReport(id: number, report: Report): Observable<Report> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.put<Report>(
    //   `/${baseUrl}/chart/charts/${id}`,
    //   JSON.stringify(report),
    //   { headers: this.headers }
    // );
    return this.apiService.PUT<Report>(
      `charts`,
      JSON.stringify(report),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  deleteReport(reportId: number): Observable<string> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.delete<string>(`/${baseUrl}/chart/charts/${reportId}`, {
    //   headers: this.headers,
    // });
    return this.apiService.DELETE<string>(
      `charts/${reportId}`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  // utils
  prepareTableData(
    reportLabels,
    reportData,
    dimensions,
    measures,
    criteria
  ): TableDetail {
    // log.info(`--------------------------------`)
    // log.info(`report labels >>>`, reportLabels);
    // log.info(`reportData >>>`, reportData);
    // log.info(`dimensions >>>`, dimensions);
    // log.info(`measures >>>`, measures);
    // log.info(`criteria >>>`, criteria);
    // log.info(`--------------------------------`)

    const tableHead = [];
    const header = [...dimensions, ...measures];

    header.forEach((x) => {
      const query = x.split('.')[1];
      const headerName = criteria.filter((q) => q.query === query)[0]
        ?.queryName;
      tableHead.push(headerName);
    });

    const tableRows = []; // always initialize table to empty array before populating
    const elementLength = reportLabels[0]?.length;
    let enhancedChartLabels = [];

    for (let i = 0; i < elementLength; i++) {
      const arr = [];
      reportLabels.forEach((item, j) => {
        arr.push(item[i]);
      });
      enhancedChartLabels.push(arr);
    }

    let tableData = [...enhancedChartLabels];
    reportData.forEach((x) => tableData.push(x));

    const dataLength = tableData[0]?.length;

    for (let i = 0; i < dataLength; i++) {
      const rowData = [];
      for (let j = 0; j < tableData.length; j++) {
        rowData.push(tableData[j][i]);
      }
      tableRows.push(rowData);
    }

    const cols = [],
      rows = [];

    tableHead.forEach((el, i) => {
      const field = el?.replace(/\s/g, ''); // remove whitespaces from field name
      cols[i] = { field, header: el };
    });

    tableRows.forEach((row, i) => {
      let rowItem = {};
      cols.forEach((col, j) => {
        const fieldValue =
          typeof row[j] === 'number'
            ? (Math.round(row[j] * 100) / 100).toFixed(2)
            : row[j];
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
      urlIdentifier: '',
      rowsPerPage: 20,
    };

    return tableDetails;
  }

  generateReportDatasets(reportLabels, reportData, measures) {
    let datasets = [];
    for (let i = 0; i < reportData.length; i++) {
      const dataset = {
        data: reportData[i],
        label: measures[i].split('.')[1],
      };
      datasets.push(dataset);
    }
    return datasets;
  }

  getChartReports(): Observable<Pagination<ChartReports[]>> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.get<Pagination<ChartReports[]>>(
    //   `/${baseUrl}/chart/chart-reports`
    // );
    return this.apiService.GET<Pagination<ChartReports[]>>(
      `chart-reports`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  renameChartReports(
    id: number,
    chartReportRename: RenameDTO
  ): Observable<RenameDTO> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.put<RenameDTO>(
    //   `/${baseUrl}/chart/chart-reports/${id}/name`,
    //   JSON.stringify(chartReportRename),
    //   { headers: this.headers }
    // );
    return this.apiService.PUT<RenameDTO>(
      `chart/chart-reports/${id}/name`,
      JSON.stringify(chartReportRename),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  /*Create a new dashboard*/
  saveDashboard(
    dashboard: CreateUpdateDashboardDTO
  ): Observable<CreateUpdateDashboardDTO> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.post<CreateUpdateDashboardDTO>(
    //   `/${baseUrl}/chart/dashboards`,
    //   JSON.stringify(dashboard),
    //   { headers: this.headers }
    // );
    return this.apiService.POST<CreateUpdateDashboardDTO>(
      `chart/dashboards`,
      JSON.stringify(dashboard),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  getDashboards(): Observable<any> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.get<any>(`/${baseUrl}/chart/dashboards`);
    return this.apiService.GET<any>(
      `dashboards`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  getDashboardsById(id: number): Observable<any> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.get<any>(`/${baseUrl}/chart/dashboards/${id}`);
    return this.apiService.GET<any>(
      `dashboards/${id}`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  deleteDashboard(dashboardId: number): Observable<string> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.delete<string>(
    //   `/${baseUrl}/chart/dashboards/${dashboardId}`,
    //   { headers: this.headers }
    // );
    return this.apiService.DELETE<string>(
      `dashboards/${dashboardId}`,
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  addReportToDashboard(
    dashboardId: number,
    dashboardReport: AddReportToDashDTO
  ): Observable<DashboardReports> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.post<DashboardReports>(
    //   `/${baseUrl}/chart/dashboards/${dashboardId}/reports`,
    //   JSON.stringify(dashboardReport),
    //   { headers: this.headers }
    // );
    return this.apiService.POST<DashboardReports>(
      `chart/dashboards`,
      JSON.stringify(dashboardReport),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }

  deleteReportFromDashboard(
    dashboardId: number,
    reportId: number
  ): Observable<any> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // const params = new HttpParams().set('reportId', `${reportId}`);

    // const headers = this.headers;

    // return this.http.delete<any>(
    //   `/${baseUrl}/chart/dashboards/${dashboardId}/reports`,
    //   { headers, params }
    // );
    return this.apiService.DELETE<any>(
      `dashboards/${dashboardId}/reports`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  renameDashboard(
    id: number,
    dashboardRename: RenameDTO
  ): Observable<RenameDTO> {
    // const baseUrl = this.appConfig.config.contextPath.setup_services;
    // return this.http.put<RenameDTO>(
    //   `/${baseUrl}/chart/dashboards/${id}/name`,
    //   JSON.stringify(dashboardRename),
    //   { headers: this.headers }
    // );
    return this.apiService.PUT<RenameDTO>(
      `chart/dashboards/${id}/name`,
      JSON.stringify(dashboardRename),
      API_CONFIG.CHART_SERVICE_BASE_URL
    );
  }
}
