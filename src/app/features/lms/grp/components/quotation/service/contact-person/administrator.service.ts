import { Injectable } from '@angular/core';
import {ApiService} from "../../../../../../../shared/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  constructor(
    private api:ApiService,
  ) { }

  getAdministratorDetails(clientCode: number) {
    return this.api.GET(`contact-person?clientCode=${clientCode}`);
  }

  saveAdminDetails(adminDetails) {
    return this.api.POST('contact-person', adminDetails);
  }

  updateAdministratorDetails(contactPersonCode: number, adminDetails) {
    return this.api.PUT(`contact-person/${contactPersonCode}`, adminDetails);
  }

  deleteAdministrator(contactPersonCode: number) {
    return this.api.DELETE(`contact-person/${contactPersonCode}`);
  }
}
