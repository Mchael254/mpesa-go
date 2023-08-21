import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError, forkJoin, map } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { Products, Product_group, SubclassesDTO } from '../../data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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
    


  getAllProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`/${this.baseurl}/${this.setupsbaseurl}/products`).pipe(
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
  createProducts(data: any): Observable<Products> {
    console.log(JSON.stringify(data))
    return this.http.post<Products>(`/${this.baseurl}/${this.setupsbaseurl}/products`, JSON.stringify(data), this.httpOptions)
      .pipe(
    )
  }
  editProducts (data:any,code:any): Observable<Products> {

    console.log(JSON.stringify(data))
    return this.http.put<Products>(`/${this.baseurl}/${this.setupsbaseurl}/products/${code}`, JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createProductSubclasses(data: any): Observable<SubclassesDTO> {
    console.log(JSON.stringify(data))
    return this.http.post<SubclassesDTO>(`/${this.baseurl}/${this.setupsbaseurl}/product-subclasses`, JSON.stringify(data), this.httpOptions)
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
  updateProductGroupbyCode(data:any,code:any): Observable<Product_group>{
    return this.http.put<Product_group>(`/${this.baseurl}/${this.setupsbaseurl}/product-groups/${code}`, JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getProductGroupByCode(code: number): Observable<Product_group[]>{

    return this.http.get<Product_group[]>(`/${this.baseurl}/${this.setupsbaseurl}/product-groups/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
  getProductByCode(code: number): Observable<Products[]>{
    
    return this.http.get<Products[]>(`/${this.baseurl}/${this.setupsbaseurl}/products/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  
  }
}
