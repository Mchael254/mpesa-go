import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { ProductsExcludedTaxes } from '../../data/gisDTO';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
@Injectable({
  providedIn: 'root'
})
export class ProductsExcludedService {

  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"
  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService,
    public api:ApiService
  ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
  }
  // Error handling
  errorHandl(error: HttpErrorResponse) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
    }
    


  getAllProductsExcluded(transactionTypeCode:any): Observable<any>{
    let page = 0;
    let size = 10
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<any>(`product-excluded-taxes?transactionTypeCode=${transactionTypeCode}&page=${page}&pageSize=${size}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
  getProductsExcluded(code: any): Observable<ProductsExcludedTaxes[]>{
      
    return this.api.GET<ProductsExcludedTaxes[]>(`product-excluded-taxes/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createProductsExcluded(data:ProductsExcludedTaxes) {
    console.log(JSON.stringify(data))
    return this.api.POST<ProductsExcludedTaxes>(`product-excluded-taxes`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateProductExcluded(data:ProductsExcludedTaxes,id:any): Observable<ProductsExcludedTaxes> {
      console.log(JSON.stringify(data))
      return this.api.PUT<ProductsExcludedTaxes>(`product-excluded-taxes/${id}`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteProductExcluded(transactionTypeCode:any,productCode:any){
      return this.api.DELETE<ProductsExcludedTaxes>(`product-excluded-taxes/${transactionTypeCode}/${productCode}`,API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

  
}
