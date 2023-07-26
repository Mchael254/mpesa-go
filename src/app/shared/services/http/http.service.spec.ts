/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import { TestBed, inject } from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpCacheService } from './http-cache.service';
import { HttpClient, HttpInterceptor } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CacheInterceptor } from './cache-interceptor';
import { ApiErrorInterceptor } from './api-error-interceptor';
import { LoaderInterceptor } from './loader-interceptor';
import { Type } from '@angular/core';
import { TokenInterceptor } from './token-interceptor';

describe('HttpService', () => {
  let httpCacheService: HttpCacheService;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let interceptors: HttpInterceptor[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApiErrorInterceptor,
          useValue: jasmine.createSpy('ApiErrorInterceptor'),
        },
        CacheInterceptor,
        {
          provide: LoaderInterceptor,
          useValue: jasmine.createSpy('LoaderService'),
        },
        {
          provide: TokenInterceptor,
          useValue: jasmine.createSpy('TokenInterceptor'),
        },
        HttpCacheService,
        {
          provide: HttpClient,
          useClass: HttpService,
        },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(
      HttpTestingController as Type<HttpTestingController>
    );
    httpCacheService = TestBed.inject(HttpCacheService);

    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(function (
      this: any,
      method: string,
      url: string,
      options?: any
    ) {
      interceptors = this.interceptors;
      return realRequest.call(this, method, url, options);
    });
  });

  afterEach(() => {
    // httpCacheService.cleanCache();
    httpMock.verify();
  });

  it('should create HttpService', function () {
    expect(httpCacheService).toBeDefined();
  });

  /*it('should use cache', () => {
    // Act
    const request = http.cache().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof LoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiErrorInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeTruthy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should skip error handler', () => {
    // Act
    const request = http.skipErrorHandler().get('/toto');

    // Assert
    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof LoaderInterceptor)).toBeTruthy();
      expect(interceptors.some(i => i instanceof ApiErrorInterceptor)).toBeFalsy();
      expect(interceptors.some(i => i instanceof CacheInterceptor)).toBeFalsy();
    });
    httpMock.expectOne({}).flush({});
  });*/
});
