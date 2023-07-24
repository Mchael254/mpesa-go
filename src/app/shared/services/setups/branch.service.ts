import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrganizationBranchDto} from "../../data/common/organization-branch-dto";

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  baseUrl = this.appConfig.config.contextPath.setup_services;
  constructor(private appConfig: AppConfigService,
              private http: HttpClient)
  { }

  getBranches(organizationId: number) :Observable<OrganizationBranchDto[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('organizationId', organizationId);

    return this.http.get<OrganizationBranchDto[]>(`/${this.baseUrl}/setups/organization-branches`, {
      headers: headers,
      params: params,
    });
  }

  getBranchById(branchId: number): Observable<OrganizationBranchDto>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })

    return this.http.get<OrganizationBranchDto>(`/${this.baseUrl}/setups/organization-branches/${branchId}`, {
      headers: headers,
    });
  }

}
