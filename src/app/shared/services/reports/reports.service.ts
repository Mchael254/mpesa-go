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
      "encode_format": "RAW",
      "params": [
        {
          "name": "test",
          "value": ""
        }
      ],
      "report_format": "PDF",
      "rpt_code": rpt_code,
      "system": "GIS"
    }

    return this.api.POSTBYTE(null, payload, API_CONFIG.REPORT_SERVICE_BASE_URL);
  }

  getReportDetails(rptCode: number): Observable<ReportFileDTO> {
    return this.api.GET<ReportFileDTO>(
      `${rptCode}`,
      API_CONFIG.REPORT_SERVICE_BASE_URL,
    );
  }

  generateReport(data: any){

    return this.api.POSTBYTE(null, data, API_CONFIG.REPORT_SERVICE_BASE_URL);
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
      `${reportCode}/parameters/${rptpCode}`,
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
      '',
      API_CONFIG.REPORT_SERVICE_BASE_URL,
      paramObject
    );
  }
}
