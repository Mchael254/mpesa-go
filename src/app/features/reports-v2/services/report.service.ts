import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../core/config/app-config-service";
import {Observable} from "rxjs";
import {ReportV2} from "../../../shared/data/reports/report";

@Injectable({
  providedIn: 'root'
})
export class ReportServiceV2 {

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  /**
   * saves a report to the db and returns the saved report
   * @param report
   */
  createReport(report: ReportV2): Observable<ReportV2> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.post<ReportV2>(
      `/${baseUrl}/chart/chart-reports`, JSON.stringify(report), {headers: this.headers});
  }

  /**
   * gets a report from the DB by it's id
   * @param id
   */
  getReportById(id: number): Observable<ReportV2> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<ReportV2>(
      `/${baseUrl}/chart/chart-reports/${id}`, {headers: this.headers});
  }

}
