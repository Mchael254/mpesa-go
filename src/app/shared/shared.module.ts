import {ModuleWithProviders, NgModule} from '@angular/core';
import {APP_BASE_HREF, CommonModule, NgOptimizedImage, PlatformLocation} from '@angular/common';
import {MessageService} from "primeng/api";
import {CookieService} from "ngx-cookie-service";
import {BrowserStorage, LocalBrowserStorageService} from "./services/storage";
import {JwtService} from "./services";
import {ErrorComponent, HideMessageDirective} from "./custom-elements/custom-error-alert";
import {LoaderComponent} from "./components/loader/loader.component";
import {NotificationsComponent} from "./components/notifications/notifications.component";
import {ToastModule} from "primeng/toast";
import {ProgressBarModule} from "primeng/progressbar";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
// import {HttpService} from "../service/http/http.service";
// import {IeCacheControlInterceptor} from "./http/ie-cache-control-interceptor";
// import {AuthHeaderInterceptor} from "./http/auth-header.interceptor";
// import {ApiErrorInterceptor} from "./http/api-error-interceptor";
// import {CacheInterceptor} from "./http/cache-interceptor";
// import {LoaderInterceptor} from "./http/loader-interceptor";
// import {TokenInterceptor} from "./http/token-interceptor";
// import {HttpCacheService} from "./http/http-cache.service";
import {LoaderService} from "./services/loader.service";
import { FileExtensionPipe } from './pipes/file-extension.pipe';
import { DocViewerComponent } from './components/doc-viewer/doc-viewer.component';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http/http.service';
import { AuthHeaderInterceptor } from './services/http/auth-header.interceptor';
import { ApiErrorInterceptor } from './services/http/api-error-interceptor';
import { LoaderInterceptor } from './services/http/loader-interceptor';
import { CacheInterceptor } from './services/http/cache-interceptor';
import { TokenInterceptor } from './services/http/token-interceptor';
import { HttpCacheService } from './services/http/http-cache.service';
import { IeCacheControlInterceptor } from './services/http/ie-cache-control-interceptor';
import { OtpComponent } from './components/otp/otp.component';
import {ReactiveFormsModule} from "@angular/forms";
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {ChipsModule} from "primeng/chips";
import { CopyrightFooterComponent } from './components/copyright-footer/copyright-footer.component';
import { DynamicChartComponent } from './components/dynamic-chart/dynamic-chart.component';
import {ChartModule} from "primeng/chart";
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
export { Logger, LogLevel } from './services/logger.service';
export { untilDestroyed } from './services/until-destroyed';
export { UtilService } from './services/util.service';
// export { JwtService } from './services/jwt.service';
export { RoleGuard, AuthGuard } from './services/guard';
export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}
const SERVICES = [
  // services
  { provide: HttpClient, useClass: HttpService },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IeCacheControlInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHeaderInterceptor,
    multi: true,
  },
  // provide logger
  { provide: BrowserStorage, useClass: LocalBrowserStorageService },
  AuthService,
  MessageService,
  CookieService,
  ApiErrorInterceptor,
  CacheInterceptor,
  LoaderInterceptor,
  TokenInterceptor,
  HttpCacheService,
  JwtService,
  LoaderService,
  { provide: BrowserStorage, useClass: LocalBrowserStorageService },

  // interceptors
  { provide: HttpClient, useClass: HttpService },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IeCacheControlInterceptor,
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true },
  ApiErrorInterceptor,
  CacheInterceptor,
  LoaderInterceptor,
  TokenInterceptor,

  {
    provide: APP_BASE_HREF,
    useFactory: getBaseHref,
    deps: [PlatformLocation]
  },

];

@NgModule({
  declarations: [
    ErrorComponent,
    HideMessageDirective,
    LoaderComponent,
    NotificationsComponent,
    FileExtensionPipe,
    DocViewerComponent,
    OtpComponent,
    DynamicTableComponent,
    CopyrightFooterComponent,
    DynamicChartComponent,
    SpinnerComponent,
    DynamicFormComponent
  ],
    imports: [
        CommonModule,
        ToastModule,
        ProgressBarModule,
        NgOptimizedImage,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        ChipsModule,
        ChartModule
    ],
  exports: [
    ErrorComponent,
    HideMessageDirective,
    NotificationsComponent,
    LoaderComponent,
    FileExtensionPipe,
    DocViewerComponent,
    OtpComponent,
    DynamicTableComponent,
    CopyrightFooterComponent,
    DynamicChartComponent,
    SpinnerComponent,
    DynamicFormComponent
  ],
  // providers: [...SERVICES]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
      return {
        ngModule: SharedModule,
        providers: [...SERVICES]
      };
    }
}
