import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Logger } from '../logger/logger.service';

const log = new Logger('LoaderInterceptor');

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // this.loaderService.start();
    // this.loaderService.startXhr();
    log.info(`START LOADING: ${req?.url}`);
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // end loading if a response is received
          // this.loaderService.complete();
          // this.loaderService.completeXhr();
          log.info(`END LOADING: ${req.url}`);
          log.info(`URL: ${event.url}, STATUS: ${event.status}`);
        }
      }),
      catchError((err) => {
        log.info(`END LOADING: ${req.url}`);
        log.info(`END LOADING`);
        // end loading if an error occurs
        // this.loaderService.complete();
        // this.loaderService.completeXhr();

        return throwError(err);
      })
    );
  }
}
