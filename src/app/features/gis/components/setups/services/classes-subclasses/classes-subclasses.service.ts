import { Injectable } from '@angular/core';
import { Classes,Subclasses,classPeril,Peril,fields

 } from '../../data/gisDTO';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from 'src/app/core/config/app-config-service';
@Injectable({
  providedIn: 'root'
})
export class ClassesSubclassesService {
  setupsbaseurl = "setups/api/v1"
  baseurl = this.appConfig.config.contextPath.gis_services;

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



  getAllSubclasses(): Observable<Subclasses[]>{
    let page = 0;
    let size = 100;
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
    .set('page', `${page}`)
    .set('pageSize', `${size}`)
    return this.http.get<Subclasses[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes`,{
      params:params,
      headers:headers
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getSubclasses(code: any): Observable<Subclasses>{
    return this.http.get<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createSubClass(data:Subclasses[]) {
    console.log(JSON.stringify(data))
    return this.http.post<Subclasses[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateSubClass(data:Subclasses,id:any){
      console.log(JSON.stringify(data))
      return this.http.put<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteSubClass(id:any){
      return this.http.delete<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

    /* CLASSES SETUPS */
    getAllClasses(): Observable<Classes[]>{
      return this.http.get<Classes[]>(`/${this.baseurl}/${this.setupsbaseurl}/classes`,this.httpOptions).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
  
    getClasses(code: number): Observable<Classes>{
      return this.http.get<Classes>(`/${this.baseurl}/${this.setupsbaseurl}/classes/${code}`).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    createClass(data:Classes[]) {
      console.log(JSON.stringify(data))
      return this.http.post<Classes[]>(`/${this.baseurl}/${this.setupsbaseurl}/classes`, JSON.stringify(data),this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      } 
      updateClass(data:Classes,id:any){
        console.log(JSON.stringify(data))
        return this.http.put<Classes>(`/${this.baseurl}/${this.setupsbaseurl}/classes/${id}`, JSON.stringify(data), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      deleteClass(id:any){
        return this.http.delete<Classes>(`/${this.baseurl}/${this.setupsbaseurl}/classes/${id}`, this.httpOptions)
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


  getAllClassPerils(): Observable<classPeril[]>{
    return this.http.get<classPeril[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-section-perils`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getClassPeril(code: any): Observable<classPeril[]>{
    return this.http.get<classPeril[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-section-perils/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getPerilByClass(classCode:number){
    const params = new HttpParams()
    .set('classCode', `${classCode}`)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
    return this.http.get<classPeril[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-section-perils`,{
      params:params,
      headers:headers
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createClassPeril(data:classPeril[]) {
    console.log(JSON.stringify(data))
    return this.http.post<classPeril[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-section-perils`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateClassPeril(data:classPeril,id:any){
      console.log(JSON.stringify(data))
      return this.http.put<classPeril>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-section-perils/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteClassPeril(id:any){
      return this.http.delete<classPeril>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-section-perils/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }


    getAllPerils(): Observable<Peril[]>{
      return this.http.get<Peril[]>(`/${this.baseurl}/${this.setupsbaseurl}/perils?pageNo=0&pageSize=100`).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    getPeril(code: any): Observable<Peril>{
      return this.http.get<Peril>(`/${this.baseurl}/${this.setupsbaseurl}/perils/${code}`).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    createPeril(data:Peril[]) {
      console.log(JSON.stringify(data))
      return this.http.post<Peril[]>(`/${this.baseurl}/${this.setupsbaseurl}/perils`, JSON.stringify(data),this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      } 
      updatePeril(data:Peril,id:any){
        console.log(JSON.stringify(data))
        return this.http.put<Peril>(`/${this.baseurl}/${this.setupsbaseurl}/perils/${id}`, JSON.stringify(data), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      deletePeril(id:any){
        return this.http.delete<Peril>(`/${this.baseurl}/${this.setupsbaseurl}/perils/${id}`, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }



      getFields(){
        return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/forms`).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      getField(code:number):Observable<fields[]>{
        return this.http.get<fields[]>(`/${this.baseurl}/${this.setupsbaseurl}/forms/${code}`).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      updateFields(fields:fields[]){
        return this.http.put<fields>(`/${this.baseurl}/${this.setupsbaseurl}/fields`, [fields],this.httpOptions)
      }
}

