import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
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

  /**
   * Saves a color scheme to the DB
   * @param colorScheme {id: number, name: string, colors: string, }
   * @returns an observable of the above type
   */
  createColorScheme(colorScheme: any): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.setup_services;
    return this.http.post<any>(
      `/${baseUrl}/chart/color-schemes`, JSON.stringify(colorScheme), {headers: this.headers});
  }

  /**
   * Gets all color schemes from the DB
   * @returns an observable array of type {id: number, name: string, colors: string, }
   */
  fetchAllColorSchemes(): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.setup_services;
    return this.http.get<any>(
      `/${baseUrl}/chart/color-schemes`, {headers: this.headers});
  }


  /**
   * Deletes a color scheme by ID
   * @param id :number
   * @returns an observable of type {id: number, name: string, colors: string, }
   */
  deleteColorScheme(id: number): Observable<any> {
    const baseUrl = this.appConfig.config.contextPath.setup_services;
    return this.http.delete<any>(
      `/${baseUrl}/chart/color-schemes/${id}`, {headers: this.headers});
  }

}
