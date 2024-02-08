import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationBranchDto } from '../../../data/common/organization-branch-dto';
import { environment } from '../../../../../environments/environment';

/**
 * This service is used to manage branches
 */
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  baseUrl = this.appConfig.config.contextPath.setup_services;
  constructor(private appConfig: AppConfigService, private http: HttpClient) {}

  /**
   * Get all branches for an organization
   * @param organizationId Organization Id
   * @returns Observable<OrganizationBranchDto[]> List of branches
   */
  getBranches(
    organizationId: number,
    regionId = 46
  ): Observable<OrganizationBranchDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-TenantId': environment.TENANT_ID,
    });
    const params = new HttpParams().set('organizationId', organizationId);
    // .set('regionId', regionId);

    return this.http.get<OrganizationBranchDto[]>(
      `/${this.baseUrl}/setups/branches`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  getAllBranches(
    organizationId?: number,
    regionId?: number
  ): Observable<OrganizationBranchDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-TenantId': environment.TENANT_ID,
    });

    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }
    if (regionId !== undefined && regionId !== null) {
      paramsObj['regionId'] = regionId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.http.get<OrganizationBranchDto[]>(
      `/${this.baseUrl}/setups/branches`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  /**
   * Get a branch by Id
   * @param branchId Branch Id
   * @returns Observable<OrganizationBranchDto> Branch
   */
  getBranchById(branchId: number): Observable<OrganizationBranchDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-TenantId': environment.TENANT_ID,
    });
    const params = new HttpParams().set('organizationId', 2);

    return this.http.get<OrganizationBranchDto>(
      `/${this.baseUrl}/setups/branches/${branchId}`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  /**
   * Retrieves the branches of an organization using an HTTP GET request.
   * @method getBranch
   * @return {Observable<OrganizationBranchDto[]>} - An observable of the response containing organization branches.
   */
  getBranch(): Observable<OrganizationBranchDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.get<OrganizationBranchDto[]>(
      `/${this.baseUrl}/setups/organizations/2/branches`,
      {
        headers: headers,
      }
    );
  }
}
