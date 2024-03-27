import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError, forkJoin, map } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Products, Product_group, SubclassesDTO } from '../../data/gisDTO';
import { environment } from '../../../../../../../environments/environment';
import { SESSION_KEY } from '../../../../../../features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../../features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';
import { ApiService } from '../../../../../../shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"
  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService,
    private session_storage: SessionStorageService,
    public api:ApiService
  ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

    
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
    


  // getAllProducts(): Observable<Products[]> {
  //   return this.api.GET<Products[]>(`/${this.baseurl}/${this.setupsbaseurl}/products`,this.httpOptions).pipe(
  //     retry(1),
  //     catchError(this.errorHandl)
  //   )
  // }

  getAllProducts():Observable<Products[]>{
    let page = 0;
    let size = 1000;
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

    
    })

    return this.api.GET<Products[]>(`products?page=${page}&pageSize=${size}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )  }

  createProductgroup(data: any): Observable<Product_group> {
    console.log(JSON.stringify(data))
    return this.api.POST<Product_group>(`product-groups`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  createProducts(data: any): Observable<Products> {
    console.log(JSON.stringify(data))
    return this.api.POST<Products>(`products`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  editProducts (data:any,code:any): Observable<Products> {

    console.log(JSON.stringify(data))
    return this.api.PUT<Products>(`products/${code}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createProductSubclasses(data: any): Observable<SubclassesDTO> {
    console.log(JSON.stringify(data))
    return this.api.POST<SubclassesDTO>(`product-subclasses`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  getASubclasses (): Observable<SubclassesDTO>{

    return this.api.GET<SubclassesDTO>(`product-subclasses?pageNo=0&pageSize=90`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl) 
    );
  }
  getsubclassByCode(code: any): Observable<SubclassesDTO>{
    return this.api.GET<SubclassesDTO>(`product-subclasses/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      
    )
  }
  getGroupedData(): Observable<any[]> {
    return forkJoin([
      this.api.GET(`products?pageNo=0&pageSize=100000`,API_CONFIG.GIS_SETUPS_BASE_URL),
      this.api.GET(`product-groups?pageNo=0&pageSize=100000`,API_CONFIG.GIS_SETUPS_BASE_URL),
    ]).pipe(
      map(([products, productGroups]) => {
        return Object.values(products).map(product => {
          const pGroupCode = Object.values(productGroups).find(pGroupCode => pGroupCode.code === product.productGroupCode);
          return { ...product, pGroupCode };
        });
      })
    );
  }
  updateProductGroupbyCode(data:any,code:any): Observable<Product_group>{
    return this.api.PUT<Product_group>(`product-groups/${code}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getProductGroupByCode(code: number): Observable<Product_group[]>{

    return this.api.GET<Product_group[]>(`product-groups/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
  getProductByCode(code: number): Observable<Products[]>{
    
    return this.api.GET<Products[]>(`products/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
  getCoverToDate(coverFromDate:string,productCode :Number):Observable<any>{
    return this.api.GET<any>(`products/coverToDate?coverFromDate=${coverFromDate}&productCode=${productCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getYearOfManufacture():Observable<any>{
    return this.api.GET<any>(`products/retrieveYearofManufacture?`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getProductSubclasses (productCode): Observable<SubclassesDTO>{

    return this.api.GET<SubclassesDTO>(`product-subclasses?productCode=${productCode}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl) 
    );
  }
}
