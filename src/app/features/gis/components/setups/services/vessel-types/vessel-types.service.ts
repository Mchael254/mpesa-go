import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class VesselTypesService {

  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService,
    public api:ApiService
    ) { }

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      
      })
    }

  // Error handling
errorHandl(error: HttpErrorResponse) {
let errorMessage = '';
if(error.error instanceof ErrorEvent) {
  // Get client-side error
  errorMessage = error.error.message;
} else {
  // Get server-side error
  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
}
console.log(errorMessage);
return throwError(errorMessage);
}
getVesselTypes(
  organizationCode:number,
  page: number=0,
  size: number = 1000
  ){
  // Create an object to hold parameters only if they are provided
  const paramsObj: { [param: number]: number } = {};
     // Add optional parameters if provided
     if (organizationCode) {
      paramsObj['organizationCode'] = organizationCode;
    }
  // Add the mandatory parameter
  paramsObj['page'] = page;
  paramsObj['size'] = size;

  const params = new HttpParams({ fromObject: paramsObj });

  return this.api.GET(`api/v1/vessel-types?`, API_CONFIG.GIS_SETUPS_BASE_URL, params);
}

}
