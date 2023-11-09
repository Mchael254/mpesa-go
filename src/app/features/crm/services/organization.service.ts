import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '../../../core/config/app-config-service';
import {
  BranchContactDTO, BranchDivisionDTO, ManagersDTO, OrganizationBranchDTO, OrganizationDTO,
  OrganizationDivisionDTO, OrganizationRegionDTO, PostOrganizationDTO, PostOrganizationRegionDTO, YesNoDTO
} from '../data/organization-dto';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  baseUrl = this.appConfig.config.contextPath.setup_services;
  accountsBaseUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
  ) { }

  getOptionValues(): Observable<YesNoDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<YesNoDTO[]>(`/${this.baseUrl}/setups/yes-no-options` ,{headers:headers});
  }

  getOrganization(): Observable<OrganizationDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<OrganizationDTO[]>(`/${this.baseUrl}/setups/organizations` ,{headers:headers});
  }

  createOrganization(data: PostOrganizationDTO): Observable<PostOrganizationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostOrganizationDTO>(`/${this.baseUrl}/setups/organizations`, JSON.stringify(data),
      { headers: headers })
  }

  uploadLogo(organizationId: number, file: File) {
    let form = new FormData;
    form.append('file', file, file.name);
    return this.http.post<any>(`/${this.baseUrl}/setups/organizations/${organizationId}/update-logo`, form );
  }

  updateOrganization(organizationId: number, data: PostOrganizationDTO): Observable<PostOrganizationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostOrganizationDTO>(`/${this.baseUrl}/setups/organizations/${organizationId}`,
      data, { headers: headers })
  }

  deleteOrganization(organizationId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationDTO>(`/${this.baseUrl}/setups/organizations/${organizationId}`,
      { headers: headers });
  }

  getOrganizationDivision(organizationId: number): Observable<OrganizationDivisionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    return this.http.get<OrganizationDivisionDTO[]>(`/${this.baseUrl}/setups/divisions`
      , {
        headers: headers,
        params: params
      });
  }

  createOrganizationDivision(data: OrganizationDivisionDTO): Observable<OrganizationDivisionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<OrganizationDivisionDTO>(`/${this.baseUrl}/setups/divisions`, JSON.stringify(data),
      { headers: headers })
  }

  updateOrganizationDivision(divisionId: number, data: OrganizationDivisionDTO): Observable<OrganizationDivisionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<OrganizationDivisionDTO>(`/${this.baseUrl}/setups/divisions/${divisionId}`,
      data, { headers: headers })
  }

  deleteOrganizationDivision(divisionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationDivisionDTO>(`/${this.baseUrl}/setups/divisions/${divisionId}`,
      { headers: headers });
  }

  getOrganizationRegion(organizationId: number): Observable<OrganizationRegionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    return this.http.get<OrganizationRegionDTO[]>(`/${this.baseUrl}/setups/regions`
      , {
        headers: headers,
        params: params
      });
  }

  createOrganizationRegion(data: PostOrganizationRegionDTO): Observable<PostOrganizationRegionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostOrganizationRegionDTO>(`/${this.baseUrl}/setups/regions`, JSON.stringify(data),
      { headers: headers })
  }

  updateOrganizationRegion(regionId: number, data: PostOrganizationRegionDTO): Observable<PostOrganizationRegionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostOrganizationRegionDTO>(`/${this.baseUrl}/setups/regions/${regionId}`,
      data, { headers: headers })
  }

  deleteOrganizationRegion(regionId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationDivisionDTO>(`/${this.baseUrl}/setups/regions/${regionId}`,
      { headers: headers });
  }

  getRegionManagers(organizationId: number): Observable<ManagersDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    
    return this.http.get<ManagersDTO[]>(`/${this.accountsBaseUrl}/accounts/region-managers`
      , {
        headers: headers,
        params: params
      });
  }

  getBranchManagers(organizationId: number): Observable<ManagersDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    
    return this.http.get<ManagersDTO[]>(`/${this.accountsBaseUrl}/accounts/branch-managers`
      , {
        headers: headers,
        params: params
      });
  }

  getOrganizationBranch(organizationId: number, regionId: number): Observable<OrganizationBranchDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`)
      .set('regionId', `${regionId}`)
    return this.http.get<OrganizationBranchDTO[]>(`/${this.baseUrl}/setups/branches`
      , {
        headers: headers,
        params: params
      });
  }

  createOrganizationBranch(data: OrganizationBranchDTO): Observable<OrganizationBranchDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<OrganizationBranchDTO>(`/${this.baseUrl}/setups/branches`, JSON.stringify(data),
      { headers: headers })
  }

  updateOrganizationBranch(branchId: number, data: OrganizationBranchDTO): Observable<OrganizationBranchDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<OrganizationBranchDTO>(`/${this.baseUrl}/setups/branches/${branchId}`,
      data, { headers: headers })
  }

  deleteOrganizationBranch(branchId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OrganizationBranchDTO>(`/${this.baseUrl}/setups/branches/${branchId}`,
      { headers: headers });
  }

  getOrganizationBranchDivision(branchId: number): Observable<BranchDivisionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<BranchDivisionDTO[]>(`/${this.baseUrl}/setups/branches/${branchId}/divisions`,
    {headers: headers})

  }

  getOrganizationBranchContact(branchId: number): Observable<BranchContactDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('branchId', `${branchId}`);
    return this.http.get<BranchContactDTO[]>(`/${this.baseUrl}/setups/branch-contacts`
      , {
        headers: headers,
        params: params
      });
  }

  createOrganizationBranchContact(data: BranchContactDTO): Observable<BranchContactDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<BranchContactDTO>(`/${this.baseUrl}/setups/branch-contacts`, JSON.stringify(data),
      { headers: headers })
  }

  updateOrganizationBranchContact(branchId: number, data: BranchContactDTO): Observable<BranchContactDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<BranchContactDTO>(`/${this.baseUrl}/setups/branch-contacts/${branchId}`,
      data, { headers: headers })
  }

  deleteOrganizationBranchContact(branchId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<BranchContactDTO>(`/${this.baseUrl}/setups/branch-contacts/${branchId}`,
      { headers: headers });
  }
}
