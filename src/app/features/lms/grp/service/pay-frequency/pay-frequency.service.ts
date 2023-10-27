import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PayFrequencyService {

  constructor( private api: ApiService) { }

  getPayFrequencies() {
    return this.api.GET('pay-frequencies');
  }
}
