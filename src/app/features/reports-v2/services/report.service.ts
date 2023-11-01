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


  /**
   * Get all reports from DB
   * @param page 
   * @param folder 
   * @returns 
   */
  getReports(
    page = 0,
    folder = null
  ): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<any>(
      `/${baseUrl}/chart/chart-reports?page=${page}`, {headers: this.headers});
  }

  findUserById(id: number): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.users_services;
    return this.http.get<any>(
      `/${baseUrl}/administration/users/${id}`, {headers: this.headers});
  }

  updateReport(report: ReportV2): Observable<ReportV2> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.put<ReportV2>(
      `/${baseUrl}/chart/chart-reports/${report.id}`, JSON.stringify(report), {headers: this.headers});
  }

  deleteReportCharts(id: number) {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.delete<ReportV2>(
      `/${baseUrl}/chart/chart-reports/${id}/charts`, {headers: this.headers});
  }

  deleteReport(id: number) {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.delete(
      `/${baseUrl}/chart/chart-reports/${id}`, {headers: this.headers});
  }

  fetchFilterConditions() {
    const metricConditions = [
      {label: 'Greater than', value: 'gt'},
      {label: 'Greater than or equal', value: 'gte'},
      {label: 'Lower than', value: 'lt'},
      {label: 'Lower than or equal', value: 'lte'},
      {label: 'Equals', value: 'equals'},
      {label: 'Not equals', value: 'notEquals'},
      {label: 'Between', value: 'between'},
    ];

    const dimensionConditions = [
      {label: 'Starts with', value: 'startsWith'},
      {label: 'Contains', value: 'contains'},
      {label: 'Not contains', value: 'notContains'},
      {label: 'Ends with', value: 'endsWith'},
    ];

  const dateConditions = [
      {label: 'In date range', value: 'inDateRange'},
      {label: 'Not in date range', value: 'notInDateRange'},
      {label: 'Before date', value: 'beforeDate'},
      {label: 'After date', value: 'afterDate'},
    ];

  return { metricConditions, dimensionConditions, dateConditions };
  }

}
