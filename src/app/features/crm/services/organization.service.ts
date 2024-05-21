import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  BranchAgencyDTO,
  BranchContactDTO,
  BranchDivisionDTO,
  CrmApiResponse,
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
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

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

  // Define selectedBranch$ and its associated BehaviorSubject
  private selectedBranchSource = new BehaviorSubject<number | null>(null);
  selectedBranch$ = this.selectedBranchSource.asObservable();

  constructor(private utilService: UtilService, private api: ApiService) {}

  setSelectedOrganizationId(organizationId: number) {
    this.selectedOrganizationIdSource.next(organizationId);
  }

  setSelectedRegion(selectedRegion: number) {
    this.selectedRegionSource.next(selectedRegion);
  }

  setSelectedBranch(selectedBranch: number) {
    this.selectedBranchSource.next(selectedBranch);
  }

  getOptionValues(): Observable<YesNoDTO[]> {
    return this.api.GET<YesNoDTO[]>(
      `system-definitions/yes-no-options`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOrganization(): Observable<OrganizationDTO[]> {
    return this.api.GET<OrganizationDTO[]>(
      `organizations`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createOrganization(
    data: PostOrganizationDTO
  ): Observable<PostOrganizationDTO> {
    return this.api.POST<PostOrganizationDTO>(
      `organizations`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  uploadLogo(organizationId: number, file: File) {
    let form = new FormData();
    form.append('file', file, file.name);
    return this.api.POST<any>(
      `organizations/${organizationId}/update-logo`,
      form,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOrganization(
    organizationId: number,
    data: PostOrganizationDTO
  ): Observable<PostOrganizationDTO> {
    return this.api.PUT<PostOrganizationDTO>(
      `organizations/${organizationId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOrganization(organizationId: number) {
    return this.api.DELETE<OrganizationDTO>(
      `organizations/${organizationId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOrganizationDivision(
    organizationId: number
  ): Observable<OrganizationDivisionDTO[]> {
    const params = new HttpParams().set('organizationId', `${organizationId}`);
    return this.api.GET<OrganizationDivisionDTO[]>(
      `divisions`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  getOrganizationDivisionBranch(
    divisionId: number
  ): Observable<BranchDivisionDTO[]> {
    return this.api.GET<BranchDivisionDTO[]>(
      `divisions/${divisionId}/branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createOrganizationDivision(
    data: OrganizationDivisionDTO
  ): Observable<OrganizationDivisionDTO> {
    return this.api.POST<OrganizationDivisionDTO>(
      `divisions`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOrganizationDivision(
    divisionId: number,
    data: OrganizationDivisionDTO
  ): Observable<OrganizationDivisionDTO> {
    return this.api.PUT<OrganizationDivisionDTO>(
      `divisions/${divisionId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOrganizationDivision(divisionId: number) {
    return this.api.DELETE<OrganizationDivisionDTO>(
      `divisions/${divisionId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOrganizationRegion(
    organizationId: number
  ): Observable<OrganizationRegionDTO[]> {
    const params = new HttpParams().set('organizationId', `${organizationId}`);
    return this.api.GET<OrganizationRegionDTO[]>(
      `regions`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createOrganizationRegion(
    data: PostOrganizationRegionDTO
  ): Observable<PostOrganizationRegionDTO> {
    return this.api.POST<PostOrganizationRegionDTO>(
      `regions`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOrganizationRegion(
    regionId: number,
    data: PostOrganizationRegionDTO
  ): Observable<PostOrganizationRegionDTO> {
    return this.api.PUT<PostOrganizationRegionDTO>(
      `regions/${regionId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOrganizationRegion(regionId: number) {
    return this.api.DELETE<OrganizationDivisionDTO>(
      `regions/${regionId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getRegionManagers(organizationId?: number): Observable<ManagersDTO[]> {
    let params = new HttpParams();
    if (organizationId !== undefined) {
      params = params.set('organizationId', `${organizationId}`);
    }

    return this.api.GET<ManagersDTO[]>(
      `region-managers`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getBranchManagers(organizationId?: number): Observable<ManagersDTO[]> {
    let params = new HttpParams();
    if (organizationId !== undefined) {
      params = params.set('organizationId', `${organizationId}`);
    }

    return this.api.GET<ManagersDTO[]>(
      `branch-managers`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getOrganizationBranch(
    organizationId?: number,
    regionId?: number
  ): Observable<OrganizationBranchDTO[]> {
    let params = new HttpParams();
    if (organizationId !== undefined) {
      params = params.set('organizationId', `${organizationId}`);
    }
    if (regionId !== undefined) {
      params = params.set('regionId', `${regionId}`);
    }

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<OrganizationBranchDTO[]>(
      `branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }

  createOrganizationBranch(
    data: OrganizationBranchDTO
  ): Observable<OrganizationBranchDTO> {
    return this.api.POST<OrganizationBranchDTO>(
      `branches`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOrganizationBranch(
    branchId: number,
    data: OrganizationBranchDTO
  ): Observable<OrganizationBranchDTO> {
    return this.api.PUT<OrganizationBranchDTO>(
      `branches/${branchId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOrganizationBranch(branchId: number) {
    return this.api.DELETE<OrganizationBranchDTO>(
      `branches/${branchId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOrganizationBranchDivision(
    branchId: number
  ): Observable<BranchDivisionDTO[]> {
    return this.api.GET<BranchDivisionDTO[]>(
      `branches/${branchId}/divisions`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOrganizationUnassignedBranchDivision(
    branchId: number
  ): Observable<OrganizationDivisionDTO[]> {
    return this.api.GET<OrganizationDivisionDTO[]>(
      `branches/${branchId}/unassigned-divisions`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createOrganizationBranchDivision(
    branchId: number,
    data: BranchDivisionDTO
  ): Observable<BranchDivisionDTO[]> {
    return this.api.POST<BranchDivisionDTO[]>(
      `branches/${branchId}/divisions`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOrganizationBranchDivision(
    branchDivisionId: number,
    data: BranchDivisionDTO,
    branchId: number
  ): Observable<BranchDivisionDTO[]> {
    return this.api.PUT<BranchDivisionDTO[]>(
      `/branches/${branchDivisionId}/divisions/${branchId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOrganizationBranchDivision(branchDivisionId: number, branchId: number) {
    return this.api.DELETE<BranchContactDTO>(
      `branches/${branchId}/divisions/${branchDivisionId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOrganizationBranchContact(
    branchId: number
  ): Observable<BranchContactDTO[]> {
    const params = new HttpParams().set('branchId', `${branchId}`);
    return this.api.GET<BranchContactDTO[]>(
      `branch-contacts`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createOrganizationBranchContact(
    data: BranchContactDTO
  ): Observable<BranchContactDTO> {
    return this.api.POST<BranchContactDTO>(
      `branch-contacts`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOrganizationBranchContact(
    branchId: number,
    data: BranchContactDTO
  ): Observable<BranchContactDTO> {
    return this.api.PUT<BranchContactDTO>(
      `branch-contacts/${branchId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOrganizationBranchContact(branchId: number) {
    return this.api.DELETE<BranchContactDTO>(
      `branch-contacts/${branchId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOrganizationBranchAgency(branchId: number): Observable<BranchAgencyDTO[]> {
    return this.api.GET<BranchAgencyDTO[]>(
      `branches/${branchId}/branch-agencies`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createOrganizationBranchAgency(
    data: BranchAgencyDTO,
    branchId: number
  ): Observable<BranchAgencyDTO[]> {
    return this.api.POST<BranchAgencyDTO[]>(
      `branches/${branchId}/branch-agencies`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOrganizationBranchAgency(
    data: BranchAgencyDTO,
    branchAgencyId: number,
    branchId: number
  ): Observable<BranchAgencyDTO[]> {
    return this.api.PUT<BranchAgencyDTO[]>(
      `/branches/${branchId}/branch-agencies/${branchAgencyId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOrganizationBranchAgency(branchAgencyId: number, branchId: number) {
    return this.api.DELETE<BranchAgencyDTO>(
      `branches/${branchId}/branch-agencies/${branchAgencyId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  transferOrganizationBranchAgency(
    branchAgencyId: number,
    fromBranchId: number,
    toBranchId
  ): Observable<CrmApiResponse> {
    const params = new HttpParams().set('toBranchId', `${toBranchId}`);
    const body = {};
    return this.api.POST<CrmApiResponse>(
      `branches/${fromBranchId}/transfer-agencies/${branchAgencyId}`,
      body,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }
}
