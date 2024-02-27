import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class IdentityTypeService {

  IdentityFormat = [
    {
        "id": 12,
        "exampleFormat": "123/45678"
    },
    {
        "id": 1,
        "exampleFormat": "12345678"
    },
    {
        "id": 2,
        "exampleFormat": "AB123456Z"
    },
    {
        "id": 3,
        "exampleFormat": "A12345678"
    },
    {
        "id": 5,
        "exampleFormat": "12345-67890-1234"
    },
    {
        "id": 6,
        "exampleFormat": "12345/67890"
    },
    {
        "id": 9,
        "exampleFormat": "12345/67890"
    },
    {
        "id": 10,
        "exampleFormat": null
    },
    {
        "id": 33977446,
        "exampleFormat": null
    },
    {
        "id": 33977447,
        "exampleFormat": null
    },
    {
        "id": 33977448,
        "exampleFormat": null
    },
    {
        "id": 11,
        "exampleFormat": "abc/def/123456"
    }
]


  constructor(private api: ApiService) { }




  getIdentityType(){
    return this.api.GET<any>('identity-modes?organizationId=2', API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL)
  }

  // Validate identity number based on provided pattern
  validateIdentity(control: FormControl, pattern: string): ValidationErrors | null {
    if (!pattern) {
      // If pattern is not provided, return null (no validation)
      return null;
    }
    const regex = new RegExp(pattern);
    if (!regex.test(control.value)) {
      return { incorrectFormat: true };
    }
    return null;
  }




}
