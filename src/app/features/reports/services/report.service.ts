import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {SubjectAreaCategory} from "../../../shared/data/reports/subject-area-category";

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

}
