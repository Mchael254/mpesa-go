import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  PROPOSAL_BASE_URL = 'proposal'

  constructor(private api:ApiService) {}
}
