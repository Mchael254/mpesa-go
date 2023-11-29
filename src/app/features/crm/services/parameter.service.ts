import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
import { Observable } from 'rxjs';
import { UserParameterDTO } from '../data/user-parameter-dto';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
  ) { }

  // getParameter(name: string, organizationId: number): Observable<UserParameterDTO[]> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   });
  //   const params = new HttpParams()
  //     .set('name', `${name}`)
  //     .set('organizationId', `${organizationId}`);
  //   return this.http.get<UserParameterDTO[]>(`/${this.baseUrl}/setups/parameters`
  //     , {
  //       headers: headers,
  //       params: params
  //     });
  // }

  getParameter(name?: string, organizationId?: number): Observable<UserParameterDTO[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    });

    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    if (name) {
        paramsObj['name'] = name;
    }
    if (organizationId !== undefined && organizationId !== null) {
        paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.http.get<UserParameterDTO[]>(`/${this.baseUrl}/setups/parameters`, {
        headers: headers,
        params: params
    }); 
  }

   updateParameter(parameterId: number, data: UserParameterDTO): Observable<UserParameterDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<UserParameterDTO>(`/${this.baseUrl}/setups/parameters/${parameterId}`,
      data, { headers: headers })
  }

  deleteParameter(parameterId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<UserParameterDTO>(`/${this.baseUrl}/setups/parameters/${parameterId}`,
      { headers: headers });
  }

}
