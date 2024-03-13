import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AppConfigService } from '../../../core/config/app-config-service';
import {
  BranchContactDTO,
  BranchDivisionDTO,
  ManagersDTO,
  OrganizationBranchDTO,
  OrganizationDTO,
  OrganizationDivisionDTO,
  OrganizationRegionDTO,
  PostOrganizationDTO,
  PostOrganizationRegionDTO,
  YesNoDTO,
} from '../data/organization-dto';
import { UtilService } from '../../../shared/services';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private selectedOrganizationIdSource = new BehaviorSubject<number | null>(
    null
  );
  selectedOrganizationId$ = this.selectedOrganizationIdSource.asObservable();

  // Define selectedRegion$ and its associated BehaviorSubject
  private selectedRegionSource = new BehaviorSubject<number | null>(null);
  selectedRegion$ = this.selectedRegionSource.asObservable();

  baseUrl = this.appConfig.config.contextPath.setup_services;
  accountsBaseUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private utilService: UtilService
  ) {}

  setSelectedOrganizationId(organizationId: number) {
    this.selectedOrganizationIdSource.next(organizationId);
  }

  setSelectedRegion(selectedRegion: number) {
    this.selectedRegionSource.next(selectedRegion);
  }

  getOptionValues(): Observable<YesNoDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<YesNoDTO[]>(
      `/${this.baseUrl}/setups/system-definitions/yes-no-options`,
      {
        headers: headers,
      }
    );
  }

  getOrganization(): Observable<OrganizationDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<OrganizationDTO[]>(
      `/${this.baseUrl}/setups/organizations`,
      { headers: headers }
    );
  }

  createOrganization(
    data: PostOrganizationDTO
  ): Observable<PostOrganizationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostOrganizationDTO>(
      `/${this.baseUrl}/setups/organizations`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  uploadLogo(organizationId: number, file: File) {
    let form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<any>(
      `/${this.baseUrl}/setups/organizations/${organizationId}/update-logo`,
      form
    );
  }

  updateOrganization(
    organizationId: number,
    data: PostOrganizationDTO
  ): Observable<PostOrganizationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostOrganizationDTO>(
      `/${this.baseUrl}/setups/organizations/${organizationId}`,
      data,
      { headers: headers }
    );
  }

  deleteOrganization(organizationId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationDTO>(
      `/${this.baseUrl}/setups/organizations/${organizationId}`,
      { headers: headers }
    );
  }

  getOrganizationDivision(
    organizationId: number
  ): Observable<OrganizationDivisionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('organizationId', `${organizationId}`);
    return this.http.get<OrganizationDivisionDTO[]>(
      `/${this.baseUrl}/setups/divisions`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  createOrganizationDivision(
    data: OrganizationDivisionDTO
  ): Observable<OrganizationDivisionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<OrganizationDivisionDTO>(
      `/${this.baseUrl}/setups/divisions`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateOrganizationDivision(
    divisionId: number,
    data: OrganizationDivisionDTO
  ): Observable<OrganizationDivisionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<OrganizationDivisionDTO>(
      `/${this.baseUrl}/setups/divisions/${divisionId}`,
      data,
      { headers: headers }
    );
  }

  deleteOrganizationDivision(divisionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationDivisionDTO>(
      `/${this.baseUrl}/setups/divisions/${divisionId}`,
      { headers: headers }
    );
  }

  getOrganizationRegion(
    organizationId: number
  ): Observable<OrganizationRegionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('organizationId', `${organizationId}`);
    return this.http.get<OrganizationRegionDTO[]>(
      `/${this.baseUrl}/setups/regions`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  createOrganizationRegion(
    data: PostOrganizationRegionDTO
  ): Observable<PostOrganizationRegionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostOrganizationRegionDTO>(
      `/${this.baseUrl}/setups/regions`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateOrganizationRegion(
    regionId: number,
    data: PostOrganizationRegionDTO
  ): Observable<PostOrganizationRegionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostOrganizationRegionDTO>(
      `/${this.baseUrl}/setups/regions/${regionId}`,
      data,
      { headers: headers }
    );
  }

  deleteOrganizationRegion(regionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationDivisionDTO>(
      `/${this.baseUrl}/setups/regions/${regionId}`,
      { headers: headers }
    );
  }

  getRegionManagers(organizationId: number): Observable<ManagersDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('organizationId', `${organizationId}`);

    return this.http.get<ManagersDTO[]>(
      `/${this.accountsBaseUrl}/accounts/region-managers`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  getBranchManagers(organizationId: number): Observable<ManagersDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('organizationId', `${organizationId}`);

    return this.http.get<ManagersDTO[]>(
      `/${this.accountsBaseUrl}/accounts/branch-managers`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  getOrganizationBranch(
    organizationId: number,
    regionId: number
  ): Observable<OrganizationBranchDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`)
      .set('regionId', `${regionId}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.http.get<OrganizationBranchDTO[]>(
      `/${this.baseUrl}/setups/branches`,
      {
        headers: headers,
        params: paramObject,
      }
    );
  }

  createOrganizationBranch(
    data: OrganizationBranchDTO
  ): Observable<OrganizationBranchDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<OrganizationBranchDTO>(
      `/${this.baseUrl}/setups/branches`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateOrganizationBranch(
    branchId: number,
    data: OrganizationBranchDTO
  ): Observable<OrganizationBranchDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<OrganizationBranchDTO>(
      `/${this.baseUrl}/setups/branches/${branchId}`,
      data,
      { headers: headers }
    );
  }

  deleteOrganizationBranch(branchId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationBranchDTO>(
      `/${this.baseUrl}/setups/branches/${branchId}`,
      { headers: headers }
    );
  }

  getOrganizationBranchDivision(
    branchId: number
  ): Observable<BranchDivisionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<BranchDivisionDTO[]>(
      `/${this.baseUrl}/setups/branches/${branchId}/divisions`,
      { headers: headers }
    );
  }

  getOrganizationUnassignedBranchDivision(
    branchId: number
  ): Observable<OrganizationDivisionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<OrganizationDivisionDTO[]>(
      `/${this.baseUrl}/setups/branches/${branchId}/unassigned-divisions`,
      { headers: headers }
    );
  }

  createOrganizationBranchDivision(
    branchId: number,
    data: BranchDivisionDTO
  ): Observable<BranchDivisionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<BranchDivisionDTO[]>(
      `/${this.baseUrl}/setups/branches/${branchId}/divisions`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateOrganizationBranchDivision(
    branchDivisionId: number,
    data: BranchDivisionDTO,
    branchId: number
  ): Observable<BranchDivisionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<BranchDivisionDTO[]>(
      `/${this.baseUrl}/setups/branches/${branchDivisionId}/divisions/${branchId}`,
      data,
      { headers: headers }
    );
  }

  deleteOrganizationBranchDivision(branchDivisionId: number, branchId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<BranchContactDTO>(
      `/${this.baseUrl}/setups/branches/${branchId}/divisions/${branchDivisionId}`,
      { headers: headers }
    );
  }

  getOrganizationBranchContact(
    branchId: number
  ): Observable<BranchContactDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('branchId', `${branchId}`);
    return this.http.get<BranchContactDTO[]>(
      `/${this.baseUrl}/setups/branch-contacts`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  createOrganizationBranchContact(
    data: BranchContactDTO
  ): Observable<BranchContactDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<BranchContactDTO>(
      `/${this.baseUrl}/setups/branch-contacts`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateOrganizationBranchContact(
    branchId: number,
    data: BranchContactDTO
  ): Observable<BranchContactDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<BranchContactDTO>(
      `/${this.baseUrl}/setups/branch-contacts/${branchId}`,
      data,
      { headers: headers }
    );
  }

  deleteOrganizationBranchContact(branchId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<BranchContactDTO>(
      `/${this.baseUrl}/setups/branch-contacts/${branchId}`,
      { headers: headers }
    );
  }
}
