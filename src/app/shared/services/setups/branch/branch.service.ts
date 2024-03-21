import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationBranchDto } from '../../../data/common/organization-branch-dto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

/**
 * This service is used to manage branches
 */
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private api: ApiService) {}

  /**
   * Get all branches for an organization
   * @param organizationId Organization Id
   * @returns Observable<OrganizationBranchDto[]> List of branches
   */
  getBranches(
    organizationId: number,
    regionId = 46
  ): Observable<OrganizationBranchDto[]> {
    const params = new HttpParams().set('organizationId', organizationId);
    // .set('regionId', regionId);

    return this.api.GET<OrganizationBranchDto[]>(
      `branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  getAllBranches(
    organizationId?: number,
    regionId?: number
  ): Observable<OrganizationBranchDto[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }
    if (regionId !== undefined && regionId !== null) {
      paramsObj['regionId'] = regionId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<OrganizationBranchDto[]>(
      `branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Get a branch by Id
   * @param branchId Branch Id
   * @returns Observable<OrganizationBranchDto> Branch
   */
  getBranchById(branchId: number): Observable<OrganizationBranchDto> {
    const params = new HttpParams().set('organizationId', 2);

    return this.api.GET<OrganizationBranchDto>(
      `branches/${branchId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Retrieves the branches of an organization using an HTTP GET request.
   * @method getBranch
   * @return {Observable<OrganizationBranchDto[]>} - An observable of the response containing organization branches.
   */
  getBranch(): Observable<OrganizationBranchDto[]> {
    return this.api.GET<OrganizationBranchDto[]>(
      `organizations/2/branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
