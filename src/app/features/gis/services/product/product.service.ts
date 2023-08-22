import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, retry, throwError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { FormScreen, SubclassesDTO } from '../../components/setups/data/gisDTO';

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
  getFormScreen(code: number): Observable<FormScreen>{
    
    return this.http.get<FormScreen>(`/${this.baseurl}/${this.setupsbaseurl}/forms/${code}`).pipe(
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
  updateSubclass(data:any,code:any): Observable<SubclassesDTO> {
    console.log(JSON.stringify(data))
    return this.http.put<SubclassesDTO>(`/${this.baseurl}/${this.setupsbaseurl}/product-subclasses/${code}`, JSON.stringify(data), this.httpOptions)
    .pipe(
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
