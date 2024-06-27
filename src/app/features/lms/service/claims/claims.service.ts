import { Injectable } from "@angular/core";
import { ApiService } from "src/app/shared/services/api/api.service";
import { API_CONFIG } from "src/environments/api_service_config";

@Injectable ({
    providedIn: 'root'
})

export class ClaimsService {
    constructor (private api:ApiService) { }  

    getCausationTypes() {
        return this.api.GET(`individual/claims/enums/causation-types`, API_CONFIG.CLAIMS_SERVICE_BASE_URL)
    }
}