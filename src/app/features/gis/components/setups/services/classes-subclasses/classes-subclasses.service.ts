import {Injectable, signal} from '@angular/core';
import {
  Classes, Subclasses, classPeril, Peril, fields, SubclassesDTO, Excesses, Conditions, UWScreens
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

  //TODO: Decide on which of the two methods below or above to use
  getSubclasses1(page: number = 0, pageSize: number = 10): Observable<SubclassesDTO[]> {
    return this.http.get<SubclassesDTO[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes?pageNo=${page}&pageSize=${pageSize}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getSubclass(code: any): Observable<Subclasses>{
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
  /*SUBPERILS*/

  getAllSubperils(Code:any):Observable<any>{
        const params = new HttpParams()
        .set('subclassSectionPerilCode', `${Code}`)
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        
        })
        return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/subperils`,{
        params:params,
        headers:headers
      }).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
  }

   /* CLASS EXCESSES */
        getAllExcesses(): Observable<Excesses[]>{
          return this.http.get<Excesses[]>(`/${this.baseurl}/${this.setupsbaseurl}/class-excess`,this.httpOptions).pipe(
            retry(1),
            catchError(this.errorHandl)
          )
        }
      
        getExcessesByClass(classCode:number){
          const params = new HttpParams()
          .set('classCode', `${classCode}`)
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          
          })
          return this.http.get<Excesses[]>(`/${this.baseurl}/${this.setupsbaseurl}/class-excess`,{
            params:params,
            headers:headers
          }).pipe(
            retry(1),
            catchError(this.errorHandl)
          )
        }
      
        getExcessesDetails(code: number): Observable<Excesses>{
          return this.http.get<Excesses>(`/${this.baseurl}/${this.setupsbaseurl}/class-excess/${code}`).pipe(
            retry(1),
            catchError(this.errorHandl)
          )
        }

        createExcesses(data:Excesses[]) {
          console.log(JSON.stringify(data))
          return this.http.post<Excesses[]>(`/${this.baseurl}/${this.setupsbaseurl}/class-excess`, JSON.stringify(data),this.httpOptions)
            .pipe(
              retry(1),
              catchError(this.errorHandl)
            )
          } 
          updateExcesses(data:Excesses,id:any){
            console.log(JSON.stringify(data))
            return this.http.put<Excesses>(`/${this.baseurl}/${this.setupsbaseurl}/class-excess/${id}`, JSON.stringify(data), this.httpOptions)
            .pipe(
              retry(1),
              catchError(this.errorHandl)
            )
          }
          deleteExcesses(id:any){
            return this.http.delete<Excesses>(`/${this.baseurl}/${this.setupsbaseurl}/class-excess/${id}`, this.httpOptions)
            .pipe(
              retry(1),
              catchError(this.errorHandl)
            )
  }
        /* LOVs */

      getConditions():Observable<Conditions>{
        return this.http.get<Conditions>(`/${this.baseurl}/${this.setupsbaseurl}/excess-conditions`).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
    
      getUWScreens():Observable<UWScreens>{
        const params = new HttpParams()
        .set('screenLevel', 'U')
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        
        })
        return this.http.get<UWScreens>(`/${this.baseurl}/${this.setupsbaseurl}/screens`,{
          params:params,
          headers:headers
        }).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
  
}

