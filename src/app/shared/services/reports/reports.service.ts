import {Injectable} from '@angular/core';
import {API_CONFIG} from "../../../../environments/api_service_config";
import {ApiService} from "../api/api.service";
import {ReportFileDTO, ReportFileParams, ReportsDto, SystemReportDto} from "../../data/common/reports-dto";
import {Observable} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {UtilService} from "../util/util.service";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private api:ApiService,
    private utilService: UtilService
  ) { }

  fetchReport(rpt_code: number){
    let payload = {
      "encodeFormat": "RAW",
      "params": [
        {
          "name": "test",
          "value": ""
        }
      ],
      "reportFormat": "PDF",
      "rptCode": rpt_code,
      "system": "GIS"
    }

    return this.api.POSTBYTE('reports', payload, API_CONFIG.REPORT_SERVICE_BASE_URL);
  }

  getReportDetails(rptCode: number): Observable<ReportFileDTO> {
    return this.api.GET<ReportFileDTO>(
      `reports/${rptCode}`,
      API_CONFIG.REPORT_SERVICE_BASE_URL,
    );
  }

  generateReport(data: any){

    return this.api.POSTBYTE('reports', data, API_CONFIG.REPORT_SERVICE_BASE_URL);
  }

  getReportParameterDetails(
    reportCode: number,
    rptpCode: number,
    pattern: string = null,
  ): Observable<ReportFileParams> {
    const params = new HttpParams()
      .set('pattern', `${pattern}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<ReportFileParams>(
      `reports/${reportCode}/parameters/${rptpCode}`,
      API_CONFIG.REPORT_SERVICE_BASE_URL,
      paramObject
    );
  }

  getReportsBySystem(
    system: number,
    applicationLevel: string,
  ): Observable<SystemReportDto[]> {
    const params = new HttpParams()
      .set('system', `${system}`)
      .set('applicationLevel', `${applicationLevel}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<SystemReportDto[]>(
      'reports',
      API_CONFIG.REPORT_SERVICE_BASE_URL,
      paramObject
    );
  }

  getAssignedOrUnassignedReports(
    subModuleCode: number,
  ): Observable<SystemReportDto[]> {
    const params = new HttpParams()
      .set('subModuleCode', `${subModuleCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<SystemReportDto[]>(
      'reports-setup/assigned-unassigned',
      API_CONFIG.REPORT_SERVICE_BASE_URL,
      paramObject
    );
  }

  assignOrUnassignReport(data: any): Observable<any> {
    return this.api.POST<any>(
      `reports-setup/assign-unassign-report`,
      JSON.stringify(data),
      API_CONFIG.REPORT_SERVICE_BASE_URL,
    )
  }

  updateReportDetails(reportCode: number, description: string): Observable<any> {
    const params = new HttpParams()
      .set('reportCode', `${reportCode}`)
      .set('description', `${description}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.POST<any>(
      `reports-setup/update`,
      null,
      API_CONFIG.REPORT_SERVICE_BASE_URL,
      paramObject
    )
  }
}
