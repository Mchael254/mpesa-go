import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';
import { API_CONFIG } from '../../../../environments/api_service_config';
import { AppConfigService } from '../../../core/config/app-config-service';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = environment.API_URLS.get(API_CONFIG.SETUPS_SERVICE_BASE_URL);


  constructor(private http: HttpClient, private appConfig: AppConfigService ) {}

  private getHeaders(): HttpHeaders {

    let headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('X-TenantId', environment.TENANT_ID);

    // // For General File Downloads (e.g., PDF, Images)
    // headers = headers.append('Content-Type', 'application/octet-stream');
    // headers = headers.append('Content-Disposition', 'attachment; filename=your_file_name.extension');
    // // For Excel (XLSX) File Downloads
    // headers = headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // headers = headers.append('Content-Disposition', 'attachment; filename=your_excel_file.xlsx');
    // // For Word (DOCX) File Downloads
    // headers = headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    // headers = headers.append('Content-Disposition', 'attachment; filename=your_word_file.docx');
    // // For PDF File Downloads
    // headers = headers.append('Content-Type', 'application/pdf');
    // headers = headers.append('Content-Disposition', 'attachment; filename=your_pdf_file.pdf');
    // // For Blob Downloads (Binary Data)
    // headers = headers.append('Content-Type', 'application/octet-stream');
    // headers = headers.append('Content-Disposition', 'attachment; filename=your_blob_file.bin');
    // let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGl1c2VyIiwic2NvcGVzIjpbXSwiaXNzIjoidHVybnF1ZXN0LWxtcy1hcGlzIiwiaWF0IjoxNjkzMzg0MzI2LCJleHAiOjE2OTM1NjQzMjZ9.v8eSQVRtYHWTknHyKJ9Cson2ZKCye2kwKCrqPI635kQ'
    // headers = headers.append('Authorization', token);

    // if (!headers.has('Authorization')) {
    //   headers = headers.append('Authorization', token);
    // }

    return headers;
  }

  GET<T>(endpoint: string, BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();
    // const options = { headers, params };
    return this.http.get<T>(url, {headers}).pipe(
      // tap(data => console.log(data))
      );
  }

  POST<T>(endpoint: string, data: any, BASE_SERVICE: API_CONFIG =API_CONFIG.SETUPS_SERVICE_BASE_URL ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();
    return this.http.post<T>(url, data, { headers });
  }

  FILEUPLOAD<T>(endpoint: string, data: FormData, BASE_SERVICE: API_CONFIG = API_CONFIG.SETUPS_SERVICE_BASE_URL): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('X-TenantId', environment.TENANT_ID);

    return this.http.post<T>(url, data, { headers });
  }

  PUT<T>(endpoint: string, data: any, BASE_SERVICE: API_CONFIG =API_CONFIG.SETUPS_SERVICE_BASE_URL ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();

    return this.http.put<T>(url, data, { headers });
  }

  DELETE<T>(endpoint: string, BASE_SERVICE: API_CONFIG =API_CONFIG.SETUPS_SERVICE_BASE_URL ): Observable<T> {
    this.baseURL = environment.API_URLS.get(BASE_SERVICE);
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();

    return this.http.delete<T>(url, { headers });
  }
}
