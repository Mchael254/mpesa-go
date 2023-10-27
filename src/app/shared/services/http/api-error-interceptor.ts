/****************************************************************************
 **
 ** Author: Justus Muoka
 ** @description  This is an interceptor that handles errors from api calls
 * @implements HttpInterceptor
 ****************************************************************************/

import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, timeout } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Message, MessageService} from "primeng/api";
import { Logger } from '../logger/logger.service';
import { UtilService } from '../util/util.service';
import { AutoUnsubscribe } from '../AutoUnsubscribe';

const log = new Logger('ApiErrorInterceptor');

@Injectable()
@AutoUnsubscribe
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(
    private messageService: MessageService,
    private router: Router,
    // private loaderService: LoaderService,
    private utilService: UtilService
  ) {}

  /**
   * Intercept any http request and handle errors
   * @param req HttpRequest<any> - the request
   * @param next HttpHandler - the next handler
   * @returns Observable<HttpEvent<any>> - the observable of the http event
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      mergeMap((event: any) => {
        if (event instanceof HttpResponse) {
          // noinspection SuspiciousInstanceOfGuard
          if (
            event.headers instanceof HttpHeaders &&
            (event.headers.has('api_error_type') ||
            event.headers.has('tq_error_type'))
          ) {
            // Maybe the body contains the message
            const error = event.body;
            log.warn(error);
            return throwError(error);
          }
        }

        return of(event);
      }),
      catchError((err) => {
        log.info('catchError', err);
        // let messages: Message[] = [];

        // if (err.status === 401 || err.status === 403) {
        //   messages.push({
        //     severity: 'error',
        //     summary: err.status === 401 ? 'UNAUTHORIZED' : 'ACCESS DENIED',
        //     detail:
        //       err.status === 401
        //         ? 'Please login to proceed'
        //         : err.error['error_description'],
        //   });
        // }
        // else
          if (err instanceof HttpErrorResponse) {
          if (err.headers.has('api_error_type')) {
            log.info(`ERROR: ${JSON.stringify(err.error)}`);
            // messages = this.prepareApiError(err.error);

            // log.warn(messages);
          } else {
            // httpResponse but of no valid implementation
            log.error('Error fetched: ', err.error );
            // log.error(err);
            // messages.push({
            //   severity: 'error',
            //   summary: 'error',
            //   detail:
            //     err.error?.message ||
            //     err.error['error_description'] ||
            //     [...(err.error['errors'] || [])].join('\n') ||
            //     err.statusText,
            // });
          }

          // if (err.status === 401 /*|| err.status === 403*/) {
          //   this.router.navigateByUrl('').then((_) => {});
          // }
        } else {
          // fallback
          // messages = this.prepareApiError(err);
        }
        // this.loaderService.forceStop();
        // this.messageService.clear();
        // this.messageService.addAll(messages);

        return throwError(err);
      }),
      timeout(500000)
    );
  }

  /**
   * Prepare the error message
   * @param err any | null - the error
   * @returns Message[] - the message array
   * @private
   */
  private prepareApiError(err: any | null): Message[] {
    // this is an instance of ApiError
    let apiError = err;

    if (err instanceof Blob) {
      apiError = JSON.parse(this.utilService.blobToString(err));
    }
    const messages = [];

    log.info(`ERRORS: ${JSON.stringify(apiError)}`);

    if (apiError && apiError['errors']) {
      messages.push({
        severity: this.transformSeverity(
          apiError['errorType'].toLocaleLowerCase()
        ),
        summary: apiError['errorType'],
        detail: apiError['errors'],
      });
    } else {
      messages.push({
        severity: 'error',
        summary: 'error',
        detail: 'Seems like there is an issue with the services',
      });
    }

    return messages;
  }

  /**
   * Transform the severity of the error
   * @param type string - the type of the error
   * @returns string - the transformed type
   * @private
   */
  private transformSeverity(type: string) {
    if (type === 'warning') {
      return 'warn';
    }
    return type;
  }
}
