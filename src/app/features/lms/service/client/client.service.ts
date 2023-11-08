import {Injectable} from '@angular/core';
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  CLIENT_BASE_URL: string = 'clients';

  constructor(private api:ApiService) {}

  saveClient(clientDTO: any){
    return this.api.POST<Observable<any>>(this.CLIENT_BASE_URL, clientDTO, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }
}
