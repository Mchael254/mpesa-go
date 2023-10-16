import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '../../../core/config/app-config-service';
import { OrganizationDTO, PostOrganizationDTO } from '../data/organization-dto';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
  ) { }

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
    return this.http.post<any>(`/${this.baseUrl}/setups/organizations/${organizationId}/logo`, form );
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
    return this.http.delete<OrganizationDTO[]>(`/${this.baseUrl}/setups/organizations/${organizationId}`,
      { headers: headers });
  }
}
