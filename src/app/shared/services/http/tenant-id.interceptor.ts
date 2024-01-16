import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TenantIdInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // You can retrieve the tenantId from wherever it is stored in your application.
    const tenantId = environment.TENANT_ID;

    // Clone the request and add the 'X-TenantId' header.
    const modifiedRequest = request.clone({
      setHeaders: {
        'X-Tenantid': tenantId
      }
    });

    // Pass the modified request to the next handler.
    return next.handle(modifiedRequest);
  }
}
