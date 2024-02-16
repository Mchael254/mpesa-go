import {Injectable} from '@angular/core';
import {ApiService} from "../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../environments/api_service_config";
import {Pagination} from "../../../shared/data/common/pagination";
import {Observable} from "rxjs";
import {
  PreviousCedingDTO, ReinsuranceRiskDetailsDTO,
  RiskReinsuranceRiskDetailsDTO, RiskReinsurePOSTDTO,
  TreatyParticipantsDTO,
  TreatySetupsDTO
} from "../data/reinsurance-dto";
import {HttpParams} from "@angular/common/http";
import {AuthService} from "../../../shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ReinsuranceService {
  // baseUrl = this.appConfig.config.contextPath.gis_services;
  baseUrl = 'reinsurance';
    constructor(private api:ApiService,
                private authService: AuthService,) { }

  populateTreaties(data: any): Observable<any> {

    return this.api.POST<any>(`api/v1/treaties/populate`, data, API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getTreatyParticipant(reinsuranceRiskDetailsCode: number): Observable<TreatyParticipantsDTO[]> {

    return this.api.GET<TreatyParticipantsDTO[]>(`api/v1/treatyParticipants?reinsuranceRiskDetailsCode=${reinsuranceRiskDetailsCode}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getRiskReinsuranceRiskDetails(batchNo: number): Observable<RiskReinsuranceRiskDetailsDTO[]> {

    let params = new HttpParams()
      .set('batchNo', `${batchNo}`)

    return this.api.GET<RiskReinsuranceRiskDetailsDTO[]>(`api/v1/risk-reinsurance/risk-details?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getRiskReinsurance(current: string, riskCode: number): Observable<any> {

    let params = new HttpParams()
      .set('current', `${current}`)
      .set('riskCode', `${riskCode}`)

    return this.api.GET<any>(`api/v1/risk-reinsurance?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getReinsuranceRiskDetails(policyReinsuranceRiskDetailsCode: number): Observable<Pagination<ReinsuranceRiskDetailsDTO>> {

    let params = new HttpParams()
      .set('policyReinsuranceRiskDetailsCode', `${policyReinsuranceRiskDetailsCode}`)

    return this.api.GET<Pagination<ReinsuranceRiskDetailsDTO>>(`api/v1/reinsurance-risk-details?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getReinsuranceFacreCeding(policyReinsuranceRiskDetailsCode: number): Observable<any[]> {

    let params = new HttpParams()
      .set('policyReinsuranceRiskDetailsCode', `${policyReinsuranceRiskDetailsCode}`)

    return this.api.GET<any[]>(`api/v1/reinsure-facre-ceding?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getReinsurancePool(riskCode: number, transactionNo: number): Observable<any[]> {

    let params = new HttpParams()
      .set('riskCode', `${riskCode}`)
      .set('transactionNo', `${transactionNo}`)

    return this.api.GET<any[]>(`api/v1/reinsurancePool?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getReinsuranceXolPremium(policyReinsuranceRiskDetailsCode: number, riskCode: number): Observable<any[]> {

    let params = new HttpParams()
      .set('policyReinsuranceRiskDetailsCode', `${policyReinsuranceRiskDetailsCode}`)
      .set('riskCode', `${riskCode}`)


    return this.api.GET<any[]>(`api/v1/reinsurance-xol-premium?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getReinsuranceXolPremiumParticipants(policyReinsuranceXolRiskDetailsCode: number): Observable<any[]> {

    let params = new HttpParams()
      .set('policyReinsuranceXolRiskDetailsCode', `${policyReinsuranceXolRiskDetailsCode}`)


    return this.api.GET<any[]>(`api/v1/reinsurance-xol-premium/participants?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getPreviousCeding(riskCode: number): Observable<PreviousCedingDTO[]> {

    return this.api.GET<PreviousCedingDTO[]>(`api/v1/previousCeding?riskCode=${riskCode}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getTreatySetups(reinsuranceCurrencyCode: number, reinsuranceUnderWritingyear: number, subclassCode: number):
    Observable<Pagination<TreatySetupsDTO>> {

    let params = new HttpParams()
      .set('reinsuranceCurrencyCode', `${reinsuranceCurrencyCode}`)
      .set('reinsuranceUnderWritingyear', `${reinsuranceUnderWritingyear}`)
      .set('subclassCode', `${subclassCode}`)

    return this.api.GET<Pagination<TreatySetupsDTO>>(`api/v1/treaty-setups?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  getPolicyFacreSetups(batchNo: number):
    Observable<Pagination<any>> {

    let params = new HttpParams()
      .set('batchNo', `${batchNo}`)

    return this.api.GET<Pagination<any>>(`api/v1/policy-facre-setups?${params}`,
      API_CONFIG.GIS_REINSURANCE_BASE_URL);
  }

  reinsureRisk(policyBatchNo: number, data: RiskReinsurePOSTDTO): Observable<any> {

    const assignee = this.authService.getCurrentUserName();
    let params = new HttpParams()
      .set('policyBatchNo', `${policyBatchNo}`)
      .set('policyRiskDTOS', `${data}`)
      .set('user', `${assignee}`)


    return this.api.POST<any>(`api/v1/policy-Risks-Controller/reinsure`, params, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }
}
