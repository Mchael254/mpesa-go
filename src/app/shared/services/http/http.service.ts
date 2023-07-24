import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../session-storage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly apiUrl = environment.BASE_URL; // Replace with your API base URL

  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, sessionStorage:SessionStorageService) {}

  // Helper function to set up headers for each request
  private getHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    const token = this.getAuthToken();
    let headers = this.defaultHeaders;

    // If the user is authenticated, add the token to the headers
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }

    // Add any custom headers from customHeaders object
    if (customHeaders) {
      customHeaders.keys().forEach((headerName) => {
        headers = headers.append(headerName, customHeaders.get(headerName)!);
      });
    }
    return headers;
  }

  // Function to get the authentication token from wherever you store it (e.g., localStorage, session, etc.)
  private getAuthToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // GET request
  get<T>(endpoint: string, params?: HttpParams, customHeaders?: HttpHeaders): Observable<T> {
    const headers = this.getHeaders(customHeaders);
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers, params });
  }

  // POST request
  post<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<T> {
    const headers = this.getHeaders(customHeaders);
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  // PUT request
  put<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<T> {
    const headers = this.getHeaders(customHeaders);
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  // PATCH request
  patch<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<T> {
    const headers = this.getHeaders(customHeaders);
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  // DELETE request
  delete<T>(endpoint: string, params?: HttpParams, customHeaders?: HttpHeaders): Observable<T> {
    const headers = this.getHeaders(customHeaders);
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { headers, params });
  }
}
