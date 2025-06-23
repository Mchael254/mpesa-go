import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/internal/Observable';
import {environment} from '../../../../environments/environment';
import {API_CONFIG} from '../../../../environments/api_service_config';
import {AppConfigService} from '../../../core/config/app-config-service';
import {SessionStorageService} from '../session-storage/session-storage.service';
import {StringManipulation} from '../../../features/lms/util/string_manipulation';
import {SESSION_KEY} from '../../../features/lms/util/session_storage_enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = environment.API_URLS.get(
    API_CONFIG.SETUPS_SERVICE_BASE_URL
  );

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private session_storage: SessionStorageService
  ) {
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    const tenantId = StringManipulation.returnNullIfEmpty(
      this.session_storage.get(SESSION_KEY.API_TENANT_ID)
    );
    if (tenantId) {
      headers = headers.set('X-TenantId', tenantId);
    }

    const sessionToken = this.session_storage.getItem('SESSION_TOKEN');
    if (sessionToken) {
      headers = headers.set('SESSION_TOKEN', sessionToken);
    }

    const entityType = this.session_storage.get(SESSION_KEY.ENTITY_TYPE);
    if (entityType) {
      headers = headers.set('entityType', entityType);
    }

    return headers;
  }


  GET<T>(
    endpoint: string,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL,
    params = null
  ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    let headers: HttpHeaders = this.getHeaders();

    let config = {};
    if (params === null) {
      config = {headers};
    } else {
      config = {headers, params};
    }
    return this.http.get<T>(url, config);
  }

  POST<T>(
    endpoint: string,
    data: any,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL,
    params = null
  ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    let url = '';
    if (endpoint === null) {
      url = `${this.baseURL}`;
    } else {
      url = `${this.baseURL}/${endpoint}`;
    }
    const headers = this.getHeaders();
    return this.http.post<T>(url, data, {headers, params: params});
  }

  public POSTBYTE(
    endpoint: string,
    data: any,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL,
    params = null
  ): Observable<any> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    let url = '';
    if (endpoint === null) {
      url = `${this.baseURL}`;
    } else {
      url = `${this.baseURL}/${endpoint}`;
    }
    const headers = this.getHeaders();

    return this.http.post(url, data, {headers, params, responseType: 'blob'});
  }

  public downloadFile(endpoint: string, data: any): void {
    this.POST(endpoint, data).subscribe((response: any) => {
      const blob = new Blob([response], {type: 'application/octet-stream'});
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'file.pdf'; // Change the file name if needed
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  FILEDOWNLOAD<T>(
    endpoint: string,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL
  ): Observable<Blob> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = new HttpHeaders()
      .set(
        'X-TenantId',
        StringManipulation.returnNullIfEmpty(
          this.session_storage.get(SESSION_KEY.API_TENANT_ID)
        )
      )
      .set('Accept', 'text/csv')
      .set('Content-Type', 'text/csv');
    // const options = { headers, params };
    // this.http.get('http://localhost:8080/downloadCsv', { responseType: 'blob' }).subscribe(csvData => {
    //   this.saveBlobAsFile(csvData, 'sampleCsv.csv');
    // });
    return this.http
      .get(url, {responseType: 'blob', headers})
      .pipe
      // tap(data => console.log(data))
      ();
  }

  public DOWNLOADFROMBASE64(
    base64String: string,
    fileName = 'file.pdf',
    fileType = 'application/pdf'
  ): void {
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: fileType});
    const url = window['URL'].createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window['URL'].revokeObjectURL(url);
  }

  public DOWNLOADFROMBYTES(
    bytes: Uint8Array,
    fileName = 'file.pdf',
    fileType = 'application/pdf'
  ): void {
    const blob = new Blob([bytes], {type: fileType});
    const url = window['URL'].createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window['URL'].revokeObjectURL(url);
  }

  FILEUPLOAD<T>(
    endpoint: string,
    data: FormData,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL
  ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set(
        'X-TenantId',
        StringManipulation.returnNullIfEmpty(
          this.session_storage.get(SESSION_KEY.API_TENANT_ID)
        )
      );

    return this.http.post<T>(url, data, {headers});
  }

  PUT<T>(
    endpoint: string,
    data: any,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL
  ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();

    return this.http.put<T>(url, data, {headers});
  }

  PATCH<T>(
    endpoint: string,
    data: any,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL
  ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();
    return this.http.patch<T>(url, data, {headers});
  }

  DELETE<T>(
    endpoint: string,
    BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL,
    data?: any
  ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();
    return this.http.delete<T>(url, {headers, body: data});
  }
}
