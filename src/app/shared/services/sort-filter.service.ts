import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {Pagination} from "../data/common/pagination";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../core/config/app-config-service";
import {StaffDto} from "../../features/entities/data/StaffDto";

@Injectable({
  providedIn: 'root'
})
export class SortFilterService {

  baseUrl = this.appConfig.config.contextPath.accounts_services;
  baseStaffUrl = this.appConfig.config.contextPath.users_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  // /*Sort by date created*/
  // dateSortIntermerdiary(
  //   /*page: number = 0,
  //   size: number = 5,*/
  //   sortListFields: string,
  //   order: string
  // ): Observable<Pagination<AgentDTO>> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   })
  //   const params = new HttpParams()
  //     /* .set('page', `${page}`)
  //      .set('size', `${size}`)*/
  //     .set('dateCreated', `${sortListFields}`)
  //     .set('order', `${order}`)
  //     .set('organizationId', 2);
  //
  //   return this.http.get<Pagination<AgentDTO>>(`/${this.baseUrl}/agents`,
  //     {
  //       headers: headers,
  //       params: params,
  //     });
  // }
  // dateSortClients(
  //   /*page: number = 0,
  //   size: number = 5,*/
  //   sortListFields: string,
  //   order: string
  // ): Observable<Pagination<ClientDTO>> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   })
  //   const params = new HttpParams()
  //     /* .set('page', `${page}`)
  //      .set('size', `${size}`)*/
  //     .set('dateCreated', `${sortListFields}`)
  //     .set('order', `${order}`)
  //     .set('organizationId', 2);
  //
  //   return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/clients`,
  //     {
  //       headers: headers,
  //       params: params,
  //     });
  // }
  // dateSortStaff(
  //   /*page: number = 0,
  //   size: number = 5,*/
  //   userType: string,
  //   sortListFields: string,
  //   order: string
  // ): Observable<Pagination<StaffDto>> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   })
  //   const params = new HttpParams()
  //     /* .set('page', `${page}`)
  //      .set('size', `${size}`)*/
  //     .set('userType', `${userType}`)
  //     .set('dateCreated', `${sortListFields}`)
  //     .set('order', `${order}`)
  //     .set('groupId', 1);
  //
  //   return this.http.get<Pagination<StaffDto>>(`/${this.baseStaffUrl}/administration/users`,
  //     {
  //       headers: headers,
  //       params: params,
  //     });
  // }
  // dateSortEntities(
  //   /*page: number = 0,
  //   size: number = 5,*/
  //   sortListFields: string,
  //   order: string
  // ): Observable<Pagination<EntityDto>> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   })
  //   const params = new HttpParams()
  //     /* .set('page', `${page}`)
  //      .set('size', `${size}`)*/
  //     .set('dateCreated', `${sortListFields}`)
  //     .set('order', `${order}`);
  //
  //   return this.http.get<Pagination<EntityDto>>(`/${this.baseUrl}/parties/all-parties`,
  //     {
  //       headers: headers,
  //       params: params,
  //     });
  // }

  sortStaff(
      userType: string,
      sortList: string = 'dateCreated',
      order: string = 'desc',
      groupId: number = 1,
      page: number = 0,
      size: number = 5
  ): Observable<Pagination<StaffDto>> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
        .set('page', `${page}`)
        .set('size', `${size}`)
        .set('userType', `${userType}`)
        .set('groupId', `${groupId}`) /*TODO: Find proper way to fetch groupId*/
        .set('sortList', `${sortList}`)
        .set('order', `${order}`);

    return this.http.get<Pagination<StaffDto>>(`/${this.baseStaffUrl}/administration/users`, {
      headers: header,
      params: params,
    });
  }
}
