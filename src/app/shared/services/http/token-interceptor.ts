/****************************************************************************
 **
 ** Author: Justus Muoka
 *  @description This is an interceptor that adds the token to the header of every request
 *  @implements HttpInterceptor
 ****************************************************************************/

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Logger } from '../logger/logger.service';
import { JwtService } from '../jwt/jwt.service';
import { DeviceDetectorService } from 'ngx-device-detector';

const log = new Logger('TokenInterceptor');

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private jwt: JwtService,
    private deviceDetectorService: DeviceDetectorService
  ) {}

  /**
   * @description intercepts the request and adds the token to the Authorization header
   * @param req HttpRequest<any> - the request to be intercepted
   * @param next HttpHandler - the next handler
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.jwt.getToken();
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    let device = 'unknown';
    let browser: string;
    browser = `${deviceInfo.browser} ${deviceInfo.browser_version}`;
    if (this.deviceDetectorService.isDesktop()) {
      device = deviceInfo.os_version;
    } else if (
      this.deviceDetectorService.isMobile() ||
      this.deviceDetectorService.isTablet()
    ) {
      device = deviceInfo.device;
    }

    if (token) {
      const authReq = req.clone({
        withCredentials: true,
        setHeaders: {
          Authorization: `Bearer ${token}`,
          os: device,
          browser: browser,
        },
      });
      return next.handle(authReq);
    } else {
      const myReq = req.clone({
        setHeaders: {
          os: device,
          browser: browser,
        },
      });

      return next.handle(myReq);
    }
  }
}
