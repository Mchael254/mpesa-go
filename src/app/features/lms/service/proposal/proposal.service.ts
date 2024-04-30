import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  PROPOSAL_BASE_URL = 'proposal'

  constructor(private api:ApiService) {}
}
