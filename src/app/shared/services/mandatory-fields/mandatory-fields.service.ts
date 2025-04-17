import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {MandatoryFieldsDTO} from "../../data/common/mandatory-fields-dto";
import {ApiService} from "../api/api.service";
import {API_CONFIG} from "../../../../environments/api_service_config";

/**
 * Service class to get list of mandatory fields for forms
 */

@Injectable({
  providedIn: 'root'
})
export class MandatoryFieldsService {

  constructor(
    private api: ApiService

  ) { }

  /**
   * Get list of mandatory fields by group id
   * @param groupId {string} Group id
   * @returns {Observable<MandatoryFieldsDTO[]>} List of mandatory fields
   */
  getMandatoryFieldsByGroupId(groupId: string): Observable<MandatoryFieldsDTO[]> {
    return this.api.GET<MandatoryFieldsDTO[]>(
      `form-fields/group/${groupId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getMockFormFields(): Observable<any> {
    return this.api.GET<any>(
      'data/fields.json',
      API_CONFIG.NONE_BASE_URL
    );
  }
}
