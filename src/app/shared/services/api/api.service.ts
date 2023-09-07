import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Content-Type', 'application/json');

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
    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGl1c2VyIiwic2NvcGVzIjpbXSwiaXNzIjoidHVybnF1ZXN0LWxtcy1hcGlzIiwiaWF0IjoxNjkzMzg0MzI2LCJleHAiOjE2OTM1NjQzMjZ9.v8eSQVRtYHWTknHyKJ9Cson2ZKCye2kwKCrqPI635kQ'
    headers = headers.append('Authorization', token);

    // if (!headers.has('Authorization')) {
    //   headers = headers.append('Authorization', token);
    // }

    return headers;
  }

  GET(endpoint: string, params?: HttpParams): Observable<any> {
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();
    const options = { headers, params };

    return this.http.get(url, options);
  }

  POST(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseURL}/${endpoint}`;
    const headers = this.getHeaders();

    return this.http.post(url, data, { headers });
  }

}
