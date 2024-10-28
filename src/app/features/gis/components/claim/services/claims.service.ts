import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from 'src/environments/api_service_config';

export interface ClaimFormData {
  product: string;
  policy: string;
  lossDate: string;
  lossTime: string;
  risk: string;
  notificationDate: string;
  causation: string;
  catastropheEvent: string;
  claimDescription: string;
  partyToBlame: string;
  averageBasicSalary: string;
  averageEarnings: string;
  offDutyDateFrom: string;
  offDutyDateTo: string;
  liabilityAdmission: boolean;
  nextReviewDate: string;
  nextReviewUser: string;
  priorityLevel: string;
  referenceNumber: string;
  accidentLocation: string;
  insuredAsClaimant: boolean;
  claimant: string;
  communicationModes: {
    phone: boolean;
    email: boolean;
    sms: boolean;
  };
  paymentModes: {
    cheque: boolean;
    emt: boolean;
    mpay: boolean;
  };
  peril: string;
  claimEstimate: string;
}
@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private formDataSubject = new BehaviorSubject<ClaimFormData>({
    product: '',
    policy: '',
    lossDate: '',
    lossTime: '',
    risk: '',
    notificationDate: '',
    causation: '',
    catastropheEvent: '',
    claimDescription: '',
    partyToBlame: '',
    averageBasicSalary: '',
    averageEarnings: '',
    offDutyDateFrom: '',
    offDutyDateTo: '',
    liabilityAdmission: false,
    nextReviewDate: '',
    nextReviewUser: '',
    priorityLevel: '',
    referenceNumber: '',
    accidentLocation: '',
    insuredAsClaimant: false,
    claimant: '',
    communicationModes: {
      phone: false,
      email: false,
      sms: false,
    },
    paymentModes: {
      cheque: false,
      emt: false,
      mpay: false,
    },
    peril: '',
    claimEstimate: '',
  });

  formData$ = this.formDataSubject.asObservable();
  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private session_storage: SessionStorageService,
    private api: ApiService
  ) { }

  updateFormData(data: Partial<ClaimFormData>) {
    this.formDataSubject.next({ ...this.formDataSubject.value, ...data });
  }

  getFormData(): ClaimFormData {
    return this.formDataSubject.value;
  }

  getCausations(){
    return this.api.GET(`api/v1/causations`, API_CONFIG.GIS_SETUPS_BASE_URL)
  }
  getUsers(){
    return this.api.GET(`users`, API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL)
  }
  getSubPerilsbyCode(code){
    return this.api.GET(`api/v1/subperils?subclassCode=${code}`, API_CONFIG.GIS_SETUPS_BASE_URL)
  }
  addClaimPeril(data){
    return this.api.POST(`api/v1/claim-perils`,JSON.stringify(data),API_CONFIG.GIS_CLAIMS_BASE_URL)
  }
  captureClaim(data){
    return this.api.POST(`api/v1/claims/capture-claim`,JSON.stringify(data),API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getClaimByClient(clientCode){
    return this.api.GET(`api/v2/claims/client/${clientCode}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getClaimTransactionDetails(claimNo){
    return this.api.GET(`api/v1/claims/claims-transaction-details?claimNo=${claimNo}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }
  getRevisionDetails(claimNo,transactionNo){
    return this.api.GET(`api/v1/claims/revision-details?claimNo=${claimNo}&transactionNo=${transactionNo}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }
  makeReady(data){
    return this.api.POST(`api/v1/claims/make-ready`,JSON.stringify(data),API_CONFIG.GIS_CLAIMS_BASE_URL)
  }
}
