import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logger } from '../logger/logger.service';
// import { Logger } from '../services/logger.service';

const log = new Logger('IeCacheControlInterceptor');

/**
 * Adds a Cache-Control header to GET requests to prevent caching in IE.
 * @implements {HttpInterceptor}
 */
@Injectable()
export class IeCacheControlInterceptor implements HttpInterceptor {

  /**
   * Intercepts all GET requests and adds a Cache-Control header to prevent caching in IE.
   * @param req The outgoing request object to handle.
   * @param next The next interceptor in the chain, or the backend if no interceptors remain in the chain.
   */
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
