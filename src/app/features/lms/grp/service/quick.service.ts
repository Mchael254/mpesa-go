import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { map } from 'rxjs/internal/operators/map';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class QuickService {

  constructor(private api:ApiService) { }

  
}
