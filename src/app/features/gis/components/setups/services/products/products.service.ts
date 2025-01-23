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

  // baseurl = this.appConfig.config.contextPath.gis_services;
  // crmurl = this.appConfig.config.contextPath.setup_services;
  // setupsbaseurl = "setups/api/v1"
  constructor(
    private http: HttpClient,
    public appConfig: AppConfigService,
    private session_storage: SessionStorageService,
    public api: ApiService
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
    if (error.error instanceof ErrorEvent) {
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

  getAllProducts(): Observable<Products[]> {
    let page = 0;
    let size = 1000;


    return this.api.GET<Products[]>(`api/v1/products?page=${page}&pageSize=${size}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  createProductgroup(data: any): Observable<Product_group> {
    console.log(JSON.stringify(data))
    return this.api.POST<Product_group>(`api/v1/product-groups`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  createProducts(data: any): Observable<Products> {
    console.log(JSON.stringify(data))
    return this.api.POST<Products>(`api/v1/products`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  editProducts(data: any, code: any): Observable<Products> {

    console.log(JSON.stringify(data))
    return this.api.PUT<Products>(`api/v1/products/${code}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  createProductSubclasses(data: any): Observable<SubclassesDTO> {
    console.log(JSON.stringify(data))
    return this.api.POST<SubclassesDTO>(`api/v1/product-subclasses`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
    )
  }
  getASubclasses(): Observable<SubclassesDTO> {

    return this.api.GET<SubclassesDTO>(`api/v1/product-subclasses?pageNo=0&pageSize=90`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  getsubclassByCode(code: any): Observable<SubclassesDTO> {
    return this.api.GET<SubclassesDTO>(`api/v1/product-subclasses/${code}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(

    )
  }
  getGroupedData(): Observable<any[]> {
    return forkJoin([
      this.api.GET(`api/v1/products?pageNo=0&pageSize=100000`, API_CONFIG.GIS_SETUPS_BASE_URL),
      this.api.GET(`api/v1/product-groups?pageNo=0&pageSize=100000`, API_CONFIG.GIS_SETUPS_BASE_URL),
    ]).pipe(
      map(([products, productGroups]) => {
        return Object.values(products).map(product => {
          const pGroupCode = Object.values(productGroups).find(pGroupCode => pGroupCode.code === product.productGroupCode);
          return { ...product, pGroupCode };
        });
      })
    );
  }
  updateProductGroupbyCode(data: any, code: any): Observable<Product_group> {
    return this.api.PUT<Product_group>(`api/v1/product-groups/${code}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  getProductGroupByCode(code: number): Observable<Product_group[]> {

    return this.api.GET<Product_group[]>(`api/v1/product-groups/${code}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }
  getProductByCode(code: number): Observable<Products[]> {

    return this.api.GET<Products[]>(`api/v1/products/${code}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }
  getCoverToDate(coverFromDate: string, productCode: Number): Observable<any> {
    return this.api.GET<any>(`api/v1/products/coverToDate?coverFromDate=${coverFromDate}&productCode=${productCode}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getYearOfManufacture(): Observable<any> {
    return this.api.GET<any>(`api/v1/products/retrieveYearofManufacture?`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getProductSubclasses(productCode): Observable<SubclassesDTO> {

    return this.api.GET<SubclassesDTO>(`api/v1/product-subclasses?productCode=${productCode}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }


  fetchAllProducts(
    pageNo: number,
    code: number,
    productName: string,
    pageSize: number
  ): Observable<Products[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['pageNo'] = pageNo.toString();
    paramsObj['pageSize'] = pageSize.toString();

    // Add optional parameters if provided
    if (code) {
      paramsObj['code'] = code.toString();
    }
    if (productName) {
      paramsObj['productName'] = productName;
    }
    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<Products[]>(`api/v1/products?`, API_CONFIG.GIS_SETUPS_BASE_URL, params);
  }
}
