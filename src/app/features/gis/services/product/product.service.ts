import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, retry, throwError } from 'rxjs';
import { APP_CONFIG, AppConfigService } from '../../../../core/config/app-config-service';
import { FormScreen, Product_group, Products, SubclassesDTO, productDocument, report } from '../../components/setups/data/gisDTO';
import { environment } from '../../../../../environments/environment';
import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import {ApiService} from "../../../../shared/services/api/api.service";
import {StringManipulation} from "../../../lms/util/string_manipulation";
import {SESSION_KEY} from "../../../lms/util/session_storage_enum";
import {API_CONFIG} from "../../../../../environments/api_service_config";
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // baseurl = this.appConfig.config.contextPath.gis_services;
  // crmurl = this.appConfig.config.contextPath.setup_services;
  // setupsbaseurl = "setups/api/v1"

  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService,
    private session_storage: SessionStorageService,
    private api:ApiService
    ) { }

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

      })
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
  getProductGroupByCode(code: number): Observable<Product_group[]>{

    return this.api.GET<Product_group[]>(`product-groups/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }
  createProductgroup(data: any): Observable<Product_group> {
    console.log(JSON.stringify(data))
    return this.api.POST<Product_group>(`product-groups`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  getAllProducts(): Observable<Products[]> {
    return this.api.GET<Products[]>(`api/v1/products`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclasses1(): Observable<SubclassesDTO[]> {
    return this.api.GET<SubclassesDTO[]>(`sub-classes?pageNo=0&pageSize=10`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  updateProductGroupbyCode(data:any,code:any): Observable<Product_group>{
    return this.api.PUT<Product_group>(`product-groups/${code}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getAllScheduleReports(): Observable<any>{
    return this.api.GET<any>(`report-groups`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe();
  }
  getAllScreens(): Observable<any>{
    return this.api.GET<any>(`screens`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe();
  }
  getProductByCode(code: number): Observable<Products[]>{

    return this.api.GET<Products[]>(`api/v1/products/${code}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }
  getProductDetailsByCode(code: number): Observable<Products>{

    return this.api.GET<Products>(`api/v1/products/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }
  getProductDocument(code: number): Observable<any>{

    return this.api.GET<productDocument[]>(`product-documents?productCode=${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }
  getFormScreen(code: number): Observable<FormScreen>{

    return this.api.GET<FormScreen>(`forms/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }
  createProducts(data: any): Observable<Products> {
    console.log(JSON.stringify(data))
    return this.api.POST<Products>(`products`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  editProducts (data:any,code:any): Observable<Products> {
    return this.api.PUT<Products>(`products/${code}`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createProductSubclasses(data: any): Observable<any> {
    // console.log(JSON.stringify(data))
    return this.api.POST<any>(`product-subclasses`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  getASubclasses (): Observable<SubclassesDTO>{

    return this.api.GET<SubclassesDTO>(`product-subclasses?pageNo=0&pageSize=90`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  getProductSubclasses (productCode): Observable<SubclassesDTO>{

    return this.api.GET<SubclassesDTO>(`api/v1/product-subclasses?productCode=${productCode}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  getsubclassByCode(code: any): Observable<SubclassesDTO>{
    return this.api.GET<SubclassesDTO>(`product-subclasses/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(

    )
  }
  updateSubclass(data:any,code:any): Observable<SubclassesDTO> {
    console.log(JSON.stringify(data))
    return this.api.PUT<SubclassesDTO>(`product-subclasses/${code}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  saveProductDocument(data:productDocument[]) {
    return this.api.POST<productDocument[]>(`product-documents`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
     /* REPORT GROUP */

     getReportGroup(){
      return this.api.GET(`report-groups`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    getReportGroupDetails(code:any):Observable<report[]>{
      return this.api.GET<report[]>(`report-groups/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
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
}
