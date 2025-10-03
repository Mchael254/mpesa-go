import { Injectable } from '@angular/core';
import {ApiService} from "../../api/api.service";
import {Observable} from "rxjs/internal/Observable";
import {API_CONFIG} from "../../../../../environments/api_service_config";
import {
  ConfigFormFieldsDto, DynamicScreenSetupDto, DynamicScreenSetupUpdateDto, DynamicSetupImportDto,
  FormGroupsDto, FormSubGroupsDto,
  ScreenFormsDto,
  ScreensDto,
  SubModulesDto
} from "../../../data/common/dynamic-screens-dto";
import {HttpParams} from "@angular/common/http";
import {UtilService} from "../../util/util.service";

@Injectable({
  providedIn: 'root'
})
export class DynamicScreensSetupService {

  constructor(
    private api: ApiService,
    private utilService: UtilService
  ) { }

  fetchSubModules(
    moduleCode?: number,
    moduleId?: string
  ): Observable<SubModulesDto[]> {
    const params = new HttpParams()
      .set('moduleCode', `${moduleCode}`)
      .set('moduleId', `${moduleId}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<SubModulesDto[]>(
      `dynamic-screens-setup/sub-modules`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }

  fetchScreens(
    subModuleCode?: number,
    subModuleId?: string
  ): Observable<ScreensDto[]> {
    const params = new HttpParams()
      .set('subModuleCode', `${subModuleCode}`)
      .set('subModuleId', `${subModuleId}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<ScreensDto[]>(
      `dynamic-screens-setup/sub-modules/screens`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }

  fetchSections(
    screenCode?: number
  ): Observable<ScreenFormsDto[]> {

    return this.api.GET<ScreenFormsDto[]>(
      `dynamic-screens-setup/screens/${screenCode}/forms`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  fetchGroups(
    subModuleCode?: number,
    screenCode?: number,
    formCode?: number
  ): Observable<FormGroupsDto[]> {
    const params = new HttpParams()
      .set('screenCode', `${screenCode}`)
      .set('formCode', `${formCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<FormGroupsDto[]>(
      `dynamic-screens-setup/form-groupings/${subModuleCode}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }

  fetchSubGroups(
    groupCode?: number
  ): Observable<FormSubGroupsDto[]> {

    return this.api.GET<FormSubGroupsDto[]>(
      `dynamic-screens-setup/form-sub-groupings/${groupCode}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
    );
  }

  fetchFormFields(
    subModuleCode?: number,
    screenCode?: number,
    formCode?: number,
    formGroupingsCode?: number,
    formSubGroupCode?: number,
  ): Observable<ConfigFormFieldsDto[]> {
    const params = new HttpParams()
      .set('screenCode', `${screenCode}`)
      .set('formCode', `${formCode}`)
      .set('formGroupingsCode', `${formGroupingsCode}`)
      .set('formSubGroupCode', `${formSubGroupCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<ConfigFormFieldsDto[]>(
      `dynamic-screens-setup/form-fields/${subModuleCode}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }

  updateScreenSetup(data: DynamicScreenSetupUpdateDto): Observable<DynamicScreenSetupUpdateDto> {
    return this.api.PUT<DynamicScreenSetupUpdateDto>(
      `dynamic-screens-setup/screen-setup`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  exportScreenSetup(
    subModuleCode: number,
    screenCode?: number,
    formCode?: number,
    formGroupingsCode?: number,
    formSubGroupCode?: number,
  ): Observable<DynamicSetupImportDto> {
    const params = new HttpParams()
      .set('subModuleCode', `${subModuleCode}`)
      .set('screenCode', `${screenCode}`)
      .set('formCode', `${formCode}`)
      .set('formGroupCode', `${formGroupingsCode}`)
      .set('formSubGroupCode', `${formSubGroupCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<DynamicSetupImportDto>(
      `dynamic-screens-setup/export`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }

  importScreenSetup(data: any): Observable<any> {
    return this.api.POST<any>(
      `dynamic-screens-setup/import`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  fetchDynamicSetupByScreen(
    screenCode?: number,
    screenId?: string,
    subModuleId?: string,
    targetEntityShortDescription?: string
  ): Observable<DynamicScreenSetupDto> {
    const params = new HttpParams()
      .set('screenCode', `${screenCode}`)
      .set('screenId', `${screenId}`)
      .set('subModuleId', `${subModuleId}`)
      .set('targetEntityShortDescription', `${targetEntityShortDescription}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<DynamicScreenSetupDto>(
      `dynamic-screens-setup/screen-setup`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }
}
