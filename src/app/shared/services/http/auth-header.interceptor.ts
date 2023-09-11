import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';
import { Logger } from '../logger/logger.service';
import { AuthService } from '../auth.service';
import { UtilService } from '../util/util.service';

const log = new Logger('AuthHeaderInterceptor');

/**
 * Auth Header Interceptor
 * @description Adds the Authorization header to every request if there is a logged-in user.
 * @implements HttpInterceptor
 * @param {UtilService} utilService - UtilService
 * @param {AuthService} authService - AuthService
 */
@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  constructor(
    private utilService: UtilService,
    private authService: AuthService
  ) {
  }

    /**
     * Intercepts an outgoing HTTP request, and set the Authorization header if there is a logged-in user.
     * @param req HttpRequest<any>  - The outgoing HTTP request
     * @param next HttpHandler - The next interceptor in the chain, or the backend if no interceptors remain in the chain.
     */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const whiteListedUrls = ['/oauth/token', `/api/me`];

    const whiteListed = whiteListedUrls.some(url => req.url.includes(url));
    if (whiteListed) {
      return next.handle(req);
    }

    return of(req).pipe(
      // retryIfLoadingUser(this.authService.isLoading$),
      withLatestFrom(this.authService.currentUser$),
      mergeMap(([myReq, user]) => {
        if (this.utilService.isEmpty(user)) {
          return next.handle(myReq);
        }
        const userCode = this.utilService.resolveUserCode(user);
        // const userType = this.utilService.resolveUserType(user);
        log.info('userCode----, userType--->>>', userCode);
        // tq_user_type: `${userType}`,
        const newReq = req.clone({
          setHeaders: {
            tq_user_code: `${userCode}`
          }
        });
        return next.handle(newReq);
      })
    );
  }
}
