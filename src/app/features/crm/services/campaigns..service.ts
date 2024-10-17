import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../environments/api_service_config';
import {
  CampaignActivitiesDTO,
  CampaignMessagesDTO,
  CampaignsDTO,
  CampaignTargetsDTO, ClientAttributesDTO, ClientSearchAttributesDTO, ProductAttributesDTO, ProductClientAttributesDTO,
} from '../data/campaignsDTO';
import { HttpParams } from '@angular/common/http';
import { UtilService } from '../../../shared/services';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  constructor(
    private apiService: ApiService,
    private utilService: UtilService
  ) {}

  getCampaigns(): Observable<CampaignsDTO[]> {
    return this.apiService.GET<CampaignsDTO[]>(
      `campaigns`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  createCampaign(data: CampaignsDTO): Observable<CampaignsDTO> {
    return this.apiService.POST<CampaignsDTO>(
      `campaigns`,
      JSON.stringify(data),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateCampaign(
    campaignId: number,
    data: CampaignsDTO
  ): Observable<CampaignsDTO> {
    return this.apiService.PUT<CampaignsDTO>(
      `campaigns/${campaignId}`,
      data,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteCampaign(campaignId: number) {
    return this.apiService.DELETE<CampaignsDTO>(
      `campaigns/${campaignId}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getCampaignMessages(
    campaignCode: number
  ): Observable<CampaignMessagesDTO[]> {
    const params = new HttpParams().set('campaignId', `${campaignCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.apiService.GET<CampaignMessagesDTO[]>(
      `messages`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL,
      paramObject
    );
  }

  createCampaignMessage(
    data: CampaignMessagesDTO
  ): Observable<CampaignMessagesDTO> {
    return this.apiService.POST<CampaignMessagesDTO>(
      `messages`,
      JSON.stringify(data),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateCampaignMessage(
    campaignMessageId: number,
    data: CampaignMessagesDTO
  ): Observable<CampaignMessagesDTO> {
    return this.apiService.PUT<CampaignMessagesDTO>(
      `messages/${campaignMessageId}`,
      data,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteCampaignMessage(campaignMessageId: number) {
    return this.apiService.DELETE<CampaignMessagesDTO>(
      `messages/${campaignMessageId}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getCampaignTargets(
    campaignCode: number
  ): Observable<CampaignTargetsDTO[]> {
    const params = new HttpParams().set('campaignId', `${campaignCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.apiService.GET<CampaignTargetsDTO[]>(
      `targets`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL,
      paramObject
    );
  }

  createCampaignTarget(
    data: CampaignTargetsDTO
  ): Observable<CampaignTargetsDTO> {
    return this.apiService.POST<CampaignTargetsDTO>(
      `targets`,
      JSON.stringify(data),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateCampaignTarget(
    campaignTargetId: number,
    data: CampaignTargetsDTO
  ): Observable<CampaignTargetsDTO> {
    return this.apiService.PUT<CampaignTargetsDTO>(
      `targets/${campaignTargetId}`,
      data,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteCampaignTarget(campaignTargetId: number) {
    return this.apiService.DELETE<CampaignTargetsDTO>(
      `targets/${campaignTargetId}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getCampaignActivities(campaignCode: number): Observable<CampaignActivitiesDTO[]> {
    const params = new HttpParams().set('campaignId', `${campaignCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.apiService.GET<CampaignActivitiesDTO[]>(
      `campaign-activities`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL,
      paramObject
    );
  }

  createCampaignActivity(
    data: CampaignActivitiesDTO
  ): Observable<CampaignActivitiesDTO> {
    return this.apiService.POST<CampaignActivitiesDTO>(
      `campaign-activities`,
      JSON.stringify(data),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteCampaignActivity(campaignActivityId: number) {
    return this.apiService.DELETE<CampaignActivitiesDTO>(
      `campaign-activities/${campaignActivityId}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getClientAttributes( ): Observable<ClientAttributesDTO[]> {
    return this.apiService.GET<ClientAttributesDTO[]>(
      `client-attribute`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  createClientAttribute(
    data: ClientAttributesDTO
  ): Observable<ClientAttributesDTO> {
    return this.apiService.POST<ClientAttributesDTO>(
      `client-attribute`,
      JSON.stringify(data),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateClientAttribute(
    clientAttributeId: number,
    data: ClientAttributesDTO
  ): Observable<ClientAttributesDTO> {
    return this.apiService.PUT<ClientAttributesDTO>(
      `client-attribute/${clientAttributeId}`,
      data,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteClientAttribute(clientAttributeId: number) {
    return this.apiService.DELETE<ClientAttributesDTO>(
      `client-attribute/${clientAttributeId}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getClientSearchAttributes( ): Observable<ClientSearchAttributesDTO[]> {
    return this.apiService.GET<ClientSearchAttributesDTO[]>(
      `client-attribute/client-search-attributes`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getProductAttributes( ): Observable<ProductAttributesDTO[]> {
    return this.apiService.GET<ProductAttributesDTO[]>(
      `product-attribute`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  createProductAttribute(
    data: ProductAttributesDTO
  ): Observable<ProductAttributesDTO> {
    return this.apiService.POST<ProductAttributesDTO>(
      `product-attribute`,
      JSON.stringify(data),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateProductAttribute(
    productAttributeId: number,
    data: ProductAttributesDTO
  ): Observable<ProductAttributesDTO> {
    return this.apiService.PUT<ProductAttributesDTO>(
      `product-attribute/${productAttributeId}`,
      data,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteProductAttribute(productAttributeId: number) {
    return this.apiService.DELETE<ProductAttributesDTO>(
      `product-attribute/${productAttributeId}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  getProductClientAttributes(productAttributeId: number ): Observable<ProductClientAttributesDTO[]> {
    const params = new HttpParams().set('productAttributeId', `${productAttributeId}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.apiService.GET<ProductClientAttributesDTO[]>(
      `product-client-attribute`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL,
      paramObject
    );
  }

  createProductClientAttribute(
    data: ProductClientAttributesDTO
  ): Observable<ProductClientAttributesDTO> {
    return this.apiService.POST<ProductClientAttributesDTO>(
      `product-client-attribute`,
      JSON.stringify(data),
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  updateProductClientAttribute(
    productClientAttributeId: number,
    data: ProductClientAttributesDTO
  ): Observable<ProductClientAttributesDTO> {
    return this.apiService.PUT<ProductClientAttributesDTO>(
      `product-client-attribute/${productClientAttributeId}`,
      data,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }

  deleteProductClientAttribute(productClientAttributeId: number) {
    return this.apiService.DELETE<ProductClientAttributesDTO>(
      `product-client-attribute/${productClientAttributeId}`,
      API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL
    );
  }
}
