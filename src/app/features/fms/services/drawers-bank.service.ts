import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {  DrawersBankDTO } from '../receipting-dto';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
@Injectable({
  providedIn: 'root'
})
export class DrawersBankService {


  constructor(private api:ApiService) { }


getDrawersBanks(): Observable<DrawersBankDTO[]> {
  return this.api.GET<DrawersBankDTO[]>(
    `receipting/drawer-banks`,
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
  );
  }

}