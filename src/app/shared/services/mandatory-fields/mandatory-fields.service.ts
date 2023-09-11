import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../core/config/app-config-service";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MandatoryFieldsDTO} from "../../data/common/mandatory-fields-dto";

/**
 * Service class to get list of mandatory fields for forms
 */

@Injectable({
  providedIn: 'root'
})
export class MandatoryFieldsService {

  baseUrl = this.appConfig.config.contextPath.accounts_services;
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient

  ) { }

  /**
   * Get list of mandatory fields by group id
   * @param groupId {string} Group id
   * @returns {Observable<MandatoryFieldsDTO[]>} List of mandatory fields
   */
  getMandatoryFieldsByGroupId(groupId: string): Observable<MandatoryFieldsDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<MandatoryFieldsDTO[]>(`/${this.baseUrl}/setups/form-fields/group/${groupId}` ,{headers:headers});
  }
}
