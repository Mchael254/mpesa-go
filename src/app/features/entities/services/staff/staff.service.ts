import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Logger, UtilService} from "../../../../shared/services";
import {AuthService} from "../../../../shared/services/auth.service";
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import {StaffDto} from "../../data/StaffDto";

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  baseStaffUrl = this.appConfig.config.contextPath.users_services;
  baseAccountsUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient,
              private utilService: UtilService,private authService: AuthService) { }

  getStaff(
    page: number = 0,
    size: number = 10,
    userType: string,
    sortList: string = 'dateCreated',
    order: string = 'desc',
    supervisor: number
  ): Observable<Pagination<StaffDto>> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('userType', `${userType}`)
      .set('groupId', 1) /*TODO: Find proper way to fetch groupId*/
      .set('sortList', `${sortList}`)
      .set('order', `${order}`)
      .set('supervisor', `${supervisor}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<Pagination<StaffDto>>(`/${this.baseStaffUrl}/administration/users`, {
      headers: header,
      params: paramObject,
    });
  }

  getStaffById(id: number): Observable<StaffDto> {
    return this.http.get<StaffDto>(`/${this.baseStaffUrl}/administration/users/` + id);
  }


}
