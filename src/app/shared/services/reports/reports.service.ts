import {Injectable} from '@angular/core';
import {API_CONFIG} from "../../../../environments/api_service_config";
import {ApiService} from "../api/api.service";
import {ReportsDto} from "../../data/common/reports-dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private api:ApiService) { }

  generateReport(payload: ReportsDto): Observable<ReportsDto>{
    return this.api.POST(`reports`, payload, API_CONFIG.REPORT_SERVICE_BASE_URL);
  }

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
}
