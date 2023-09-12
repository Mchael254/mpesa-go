import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, retry, throwError } from 'rxjs';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { FormScreen, Product_group, Products, SubclassesDTO, productDocument, report } from '../../components/setups/data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"
  
  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService
    ) { }

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      
      })
    }

  getGroupedData(): Observable<any[]> {
    return forkJoin([
      this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/products?pageNo=0&pageSize=100000`),
      this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/product-groups?pageNo=0&pageSize=100000`),
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

    return this.http.get<Product_group[]>(`/${this.baseurl}/${this.setupsbaseurl}/product-groups/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
  createProductgroup(data: any): Observable<Product_group> {
    console.log(JSON.stringify(data))
    return this.http.post<Product_group>(`/${this.baseurl}/${this.setupsbaseurl}/product-groups`, JSON.stringify(data), this.httpOptions)
      .pipe(
    )
  }
  getAllProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`/${this.baseurl}/${this.setupsbaseurl}/products`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclasses1(): Observable<SubclassesDTO[]> {
    return this.http.get<SubclassesDTO[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes?pageNo=0&pageSize=10`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getAllScheduleReports(): Observable<any>{
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/report-groups`).pipe();
  }
  getAllScreens(): Observable<any>{
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/screens`).pipe();
  }
  getProductByCode(code: number): Observable<Products[]>{
    
    return this.http.get<Products[]>(`/${this.baseurl}/${this.setupsbaseurl}/products/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
  getProductDocument(code: number): Observable<any>{
    
    return this.http.get<productDocument[]>(`/${this.baseurl}/${this.setupsbaseurl}/product-documents?productCode=${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
  getFormScreen(code: number): Observable<FormScreen>{
    
    return this.http.get<FormScreen>(`/${this.baseurl}/${this.setupsbaseurl}/forms/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
  createProducts(data: any): Observable<Products> {
    console.log(JSON.stringify(data))
    return this.http.post<Products>(`/${this.baseurl}/${this.setupsbaseurl}/products`, JSON.stringify(data), this.httpOptions)
      .pipe(
    )
  }
  createProductSubclasses(data: any): Observable<any> {
    // console.log(JSON.stringify(data))
    return this.http.post<any>(`/${this.baseurl}/${this.setupsbaseurl}/product-subclasses`, JSON.stringify(data), this.httpOptions)
      .pipe(
    )
  }
  getASubclasses (): Observable<SubclassesDTO>{

    return this.http.get<SubclassesDTO>(`/${this.baseurl}/${this.setupsbaseurl}/product-subclasses?pageNo=0&pageSize=90`).pipe(
      retry(1),
      catchError(this.errorHandl) 
    );
  }
  getsubclassByCode(code: any): Observable<SubclassesDTO>{
    return this.http.get<SubclassesDTO>(`/${this.baseurl}/${this.setupsbaseurl}/product-subclasses/${code}`).pipe(
      
    )
  }
  updateSubclass(data:any,code:any): Observable<SubclassesDTO> {
    console.log(JSON.stringify(data))
    return this.http.put<SubclassesDTO>(`/${this.baseurl}/${this.setupsbaseurl}/product-subclasses/${code}`, JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  saveProductDocument(data:productDocument[]) {
    return this.http.post<productDocument[]>(`/${this.baseurl}/${this.setupsbaseurl}/product-documents`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
     /* REPORT GROUP */

     getReportGroup(){
      return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/report-groups`).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    getReportGroupDetails(code:any):Observable<report[]>{
      return this.http.get<report[]>(`/${this.baseurl}/${this.setupsbaseurl}/report-groups/${code}`).pipe(
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
