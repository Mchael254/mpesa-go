import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserParameterDTO } from '../data/user-parameter-dto';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  constructor(private api: ApiService) {}

  getParameter(
    name?: string,
    organizationId?: number
  ): Observable<UserParameterDTO[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    if (name) {
      paramsObj['name'] = name;
    }
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<UserParameterDTO[]>(
      `parameters`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  updateParameter(
    parameterId: number,
    data: UserParameterDTO
  ): Observable<UserParameterDTO> {
    return this.api.PUT<UserParameterDTO>(
      `parameters/${parameterId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteParameter(parameterId: number) {
    return this.api.DELETE<UserParameterDTO>(
      `parameters/${parameterId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
