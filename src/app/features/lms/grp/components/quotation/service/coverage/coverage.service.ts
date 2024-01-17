import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { CategoryDetailsDto } from '../../models/categoryDetails';

@Injectable({
  providedIn: 'root'
})
export class CoverageService {

  constructor(
    private api:ApiService,
  ) { }

  getCategoryDetails(quotation_code: number) {
    return this.api.GET(`category/${quotation_code}/categories`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);

  }

  postCategoryDetails(categoryDets: any): Observable<CategoryDetailsDto> {
    return this.api.POST('category/', categoryDets, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  updateCategoryDetails(categoryCode, categoryDetails) {
    return this.api.PUT(`category/${categoryCode}`, categoryDetails,  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  deleteCategoryDetails(category_code) {
    return this.api.DELETE(`category/${category_code}`,  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  getCoverTypes(quotationCode) {
    return this.api.GET(`quotations/covers/${quotationCode}`,  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  getCoverTypesPerProduct(productCode) {
    return this.api.GET(`cover-types/${productCode}`,  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  getSelectRateType() {
    return this.api.GET('quotations/rate-type',  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  postCoverType(coverDetails) {
    return this.api.POST('quotations/cover-types', coverDetails, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  deleteCoverType(quotationCode, coverTypeUniqueCode) {
    return this.api.DELETE(`quotations/${quotationCode}/cover-types/${coverTypeUniqueCode}`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  downloadMemberUploadTemplate(productType, productCode) {
    return this.api.FILEDOWNLOAD(`template/generate/${productType}/${productCode}`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }
  
  getMembers(quotationCode) {
    return this.api.GET(`quotations/${quotationCode}/members`,  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  getPremiumMask(productCode) {
    return this.api.GET(`quotations/premium-mask/${productCode}`,  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  addMember(quotationCode, memberDetailsFormValues) {
    return this.api.POST(`quotations/${quotationCode}/add-member`, memberDetailsFormValues, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  deleteMember(quotationCode, quoteDto) {
    return this.api.DELETE(`quotations/${quotationCode}/members`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL, quoteDto);
  }
  
  computePremium(quotationCode) {
    return this.api.POST(`quotations/${quotationCode}/compute-premium`, null, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }
  
  getOccupation() {
    return this.api.GET(`occupations`,  API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  uploadMemberTemplate(file) {
    return this.api.FILEUPLOAD('uploads', file, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

}