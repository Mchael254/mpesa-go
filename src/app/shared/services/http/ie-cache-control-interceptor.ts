import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logger } from '../logger.service';
// import { Logger } from '../services/logger.service';

const log = new Logger('IeCacheControlInterceptor');

@Injectable()
export class IeCacheControlInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method === 'GET') {
      const request = req.clone({
        setHeaders: {
          'Cache-Control': 'no-cache',
          // Pragma: 'no-cache',
        },
      });

      log.info(`Headers after interception ${req.headers}`);
      return next.handle(request);
    }

    return next.handle(req);
  }
}
