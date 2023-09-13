/****************************************************************************
 **
 ** Author: Justus Muoka
 **
 ****************************************************************************/

import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Optional,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ApiErrorInterceptor } from './api-error-interceptor';
import { CacheInterceptor } from './cache-interceptor';
import { TokenInterceptor } from './token-interceptor';
import { LoaderInterceptor } from './loader-interceptor';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

// HttpClient is declared in a re-exported module, so we have to extend the original module to make it work properly
// (see https://github.com/Microsoft/TypeScript/issues/13897)
declare module '@angular/common/http' {
  // Augment HttpClient with the added configuration methods from HttpService, to allow in-place replacement of
  // HttpClient with HttpService using dependency injection
  export interface HttpClient {
    /**
     * Enables caching for this request.
     * @return {HttpClient} The new instance.
     * @param options
     */
    cache(options?: {
      update?: boolean;
      persistence?: 'local' | 'session';
    }): HttpClient;

    /**
     * Skips default error handler for this request.
     * @return {HttpClient} The new instance.
     */
    skipErrorHandler(): HttpClient;

    /**
     * Skips default loader for this request.
     * @return {HttpClient} The new instance.
     */
    skipLoaderInterceptor(): HttpClient;

    /**
     * Skips all dynamic interceptors.
     * @return {HttpClient} The new instance.
     */
    skipAllInterceptors(): HttpClient;
  }
}

// From @angular/common/http/src/interceptor: allows to chain interceptors
class HttpInterceptorHandler implements HttpHandler {
  constructor(
    private next: HttpHandler,
    private interceptor: HttpInterceptor
  ) {}

  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(request, this.next);
  }
}

/**
 * Allows to override default dynamic interceptors that can be disabled with the HttpService extension.
 * Except for very specific needs, you should better configure these interceptors directly in the constructor below
 * for better readability.
 *
 * For static interceptors that should always be enabled (like IECacheControlInterceptor), use the standard
 * HTTP_INTERCEPTORS token.
 */
export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>(
  'HTTP_DYNAMIC_INTERCEPTORS'
);


/**
 * @description Extends HttpClient with per request configuration using dynamic interceptors.
 * @param httpHandler The original HttpHandler to chain with interceptors.
 * @param injector The application injector, required to dynamically fetch the interceptors.
 * @param interceptors The interceptors to apply to the request.
 */
@Injectable()
export class HttpService extends HttpClient {
  constructor(
    private httpHandler: HttpHandler,
    private injector: Injector,
    @Optional()
    @Inject(HTTP_DYNAMIC_INTERCEPTORS)
    private readonly interceptors: HttpInterceptor[] = []
  ) {
    super(httpHandler);

    if (!this.interceptors) {
      // Configure default interceptors that can be disabled here
      this.interceptors = [
        this.injector.get(LoaderInterceptor),
        this.injector.get(ApiErrorInterceptor),
        this.injector.get(TokenInterceptor),
      ];
    }
  }

  /**
   * Enables caching for this request.
   * @param options The cache options.
   * @return {HttpClient} The new instance.
   */
  override cache(options?: {
    update?: boolean;
    persistence?: 'local' | 'session';
  }): HttpClient {
    const cacheInterceptor = this.injector
      .get(CacheInterceptor)
      .configure(options);
    return this.addInterceptor(cacheInterceptor);
  }

  /**
   * Skips default error handler for this request.
   * @return {HttpClient} The new instance.
   */
  override skipErrorHandler(): HttpClient {
    return this.removeInterceptor(ApiErrorInterceptor);
  }

  /**
   * Skips default loader for this request.
   * @return {HttpClient} The new instance.
   */
  override skipLoaderInterceptor(): HttpClient {
    return this.removeInterceptor(LoaderInterceptor);
  }

  /**
   * Skips all dynamic interceptors.
   * @return {HttpClient} The new instance.
   */
  override skipAllInterceptors(): HttpClient {
    return new HttpService(this.httpHandler, this.injector, []);
  }

  /**
   * Performs HTTP request with dynamic interceptors.
   * @param method The HTTP method.
   * @param url The URL.
   * @param options The HTTP options.
   */
  // Override the original method to wire interceptors when triggering the request.
  override request(method?: any, url?: any, options?: any): any {
    const handler = this.interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor),
      this.httpHandler
    );
    return new HttpClient(handler).request(method, url, options);
  }

  /**
   * Removes given interceptor to the interceptors chain.
   * @param interceptorType The interceptor type.
   * @return {HttpClient} The new instance.
   * @private
   */
  private removeInterceptor(interceptorType: Function): HttpService {
    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.filter((i) => !(i instanceof interceptorType))
    );
  }

  /**
   * Adds given interceptor to the interceptors chain.
   * @param interceptor The interceptor instance.
   * @return {HttpClient} The new instance.
   * @private
   */
  private addInterceptor(interceptor: HttpInterceptor): HttpService {
    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.concat([interceptor])
    );
  }
}
