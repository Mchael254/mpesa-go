import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ColorScheme } from 'src/app/shared/data/reports/color-scheme';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ColorSchemeService {

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  createColorScheme(colorScheme: any): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.post<any>(
      `/${baseUrl}/chart/color-schemes`, JSON.stringify(colorScheme), {headers: this.headers});
  }

  fetchAllColorSchemes(): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.get<any>(
      `/${baseUrl}/chart/color-schemes`, {headers: this.headers});
  }


  deleteColorScheme(id: number): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    return this.http.delete<any>(
      `/${baseUrl}/chart/color-schemes/${id}`, {headers: this.headers});
  }

}
