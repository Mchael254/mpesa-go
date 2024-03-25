import {Injectable, signal} from '@angular/core';
import {
  Classes, Subclasses, classPeril, Peril, fields, SubclassesDTO, Excesses, Conditions, UWScreens
} from '../../data/gisDTO';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
@Injectable({
  providedIn: 'root'
})
export class ClassesSubclassesService {
  setupsbaseurl = "setups/api/v1"
  baseurl = this.appConfig.config.contextPath.gis_services;

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

  getAllSubclasses(): Observable<Subclasses[]>{
    let page = 0;
    let size = 100;

    return this.api.GET<Subclasses[]>(`sub-classes?page=${page}&pageSize=${size}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  //TODO: Decide on which of the two methods below or above to use
  getSubclasses1(page: number = 0, pageSize: number = 10): Observable<SubclassesDTO[]> {
    return this.api.GET<SubclassesDTO[]>(`sub-classes?pageNo=${page}&pageSize=${pageSize}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getSubclass(code: any): Observable<Subclasses>{
    return this.api.GET<Subclasses>(`sub-classes/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createSubClass(data:Subclasses[]) {
    console.log(JSON.stringify(data))
    return this.api.POST<Subclasses[]>(`sub-classes`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    updateSubClass(data:Subclasses,id:any){
      console.log(JSON.stringify(data))
      return this.api.PUT<Subclasses>(`sub-classes/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteSubClass(id:any){
      return this.api.DELETE<Subclasses>(`sub-classes/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

    /* CLASSES SETUPS */
    getAllClasses(): Observable<Classes[]>{
      return this.api.GET<Classes[]>(`classes`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

    getClasses(code: number): Observable<Classes>{
      return this.api.GET<Classes>(`classes/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    createClass(data:Classes[]) {
      console.log(JSON.stringify(data))
      return this.api.POST<Classes[]>(`classes`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      updateClass(data:Classes,id:any){
        console.log(JSON.stringify(data))
        return this.api.PUT<Classes>(`classes/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      deleteClass(id:any){
        return this.api.DELETE<Classes>(`classes/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
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
    return this.api.GET<classPeril[]>(`subclass-section-perils`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getClassPeril(code: any): Observable<classPeril[]>{
    return this.api.GET<classPeril[]>(`subclass-section-perils/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
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
    return this.api.GET<classPeril[]>(`subclass-section-perils`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createClassPeril(data:classPeril[]) {
    console.log(JSON.stringify(data))
    return this.api.POST<classPeril[]>(`subclass-section-perils`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    updateClassPeril(data:classPeril,id:any){
      console.log(JSON.stringify(data))
      return this.api.PUT<classPeril>(`subclass-section-perils/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteClassPeril(id:any){
      return this.api.DELETE<classPeril>(`subclass-section-perils/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }


    getAllPerils(): Observable<Peril[]>{
      return this.api.GET<Peril[]>(`perils?pageNo=0&pageSize=100`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    getPeril(code: any): Observable<Peril>{
      return this.api.GET<Peril>(`perils/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    createPeril(data:Peril[]) {
      console.log(JSON.stringify(data))
      return this.api.POST<Peril[]>(`perils`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      updatePeril(data:Peril,id:any){
        console.log(JSON.stringify(data))
        return this.api.PUT<Peril>(`perils/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      deletePeril(id:any){
        return this.api.DELETE<Peril>(`perils/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }



      getFields(){
        return this.api.GET(`forms`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      getField(code:number):Observable<fields[]>{
        return this.api.GET<fields[]>(`forms/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      updateFields(fields:fields[]){
        return this.api.PUT<fields>(`fields`, [fields],API_CONFIG.GIS_SETUPS_BASE_URL)
  }
  /*SUBPERILS*/

  getAllSubperils(Code:any):Observable<any>{
        const params = new HttpParams()
        .set('subclassSectionPerilCode', `${Code}`)
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',

        })
        return this.api.GET(`subperils`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
  }

   /* CLASS EXCESSES */
        getAllExcesses(): Observable<Excesses[]>{
          return this.api.GET<Excesses[]>(`class-excess`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
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
          return this.api.GET<Excesses[]>(`class-excess`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
            retry(1),
            catchError(this.errorHandl)
          )
        }

        getExcessesDetails(code: number): Observable<Excesses>{
          return this.api.GET<Excesses>(`class-excess/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
            retry(1),
            catchError(this.errorHandl)
          )
        }

        createExcesses(data:Excesses[]) {
          console.log(JSON.stringify(data))
          return this.api.POST<Excesses[]>(`class-excess`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
            .pipe(
              retry(1),
              catchError(this.errorHandl)
            )
          }
          updateExcesses(data:Excesses,id:any){
            console.log(JSON.stringify(data))
            return this.api.PUT<Excesses>(`class-excess/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
            .pipe(
              retry(1),
              catchError(this.errorHandl)
            )
          }
          deleteExcesses(id:any){
            return this.api.DELETE<Excesses>(`class-excess/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
            .pipe(
              retry(1),
              catchError(this.errorHandl)
            )
  }
        /* LOVs */

      getConditions():Observable<Conditions>{
        return this.api.GET<Conditions>(`excess-conditions`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
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
        return this.api.GET<UWScreens>(`screens`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }

}

