import {
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import {
  APP_BASE_HREF,
  CommonModule,
  NgOptimizedImage,
  PlatformLocation,
} from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { BrowserStorage, LocalBrowserStorageService } from './services/storage';
import { JwtService } from './services';
import { ErrorComponent, HideMessageDirective } from './custom-elements';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { LoaderService } from './services/loader.service';
import { FileExtensionPipe } from './pipes/file-extension/file-extension.pipe';
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
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import { CopyrightFooterComponent } from './components/copyright-footer/copyright-footer.component';
import { DynamicChartComponent } from './components/dynamic-chart/dynamic-chart.component';
import { ChartModule } from 'primeng/chart';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicBreadcrumbComponent } from './components/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { RouterLink } from '@angular/router';
import { StepperComponent } from './components/stepper/stepper.component';
import { VerticalStepperComponent } from './components/stepper/vertical-stepper/vertical-stepper.component';
import { HorizontalStepperComponent } from './components/stepper/horizontal-stepper/horizontal-stepper.component';
import { DynamicSimpleModalComponent } from './components/dynamic-simple-modal/dynamic-simple-modal.component';
import { DynamicFormModalComponent } from './components/dynamic-form-modal/dynamic-form-modal.component';
import { DynamicSetupFormScreenComponent } from './components/dynamic-setup-form-screen/dynamic-setup-form-screen.component';
import { DynamicSetupSearchListScreenComponent } from './components/dynamic-setup-search-list-screen/dynamic-setup-search-list-screen.component';
import { DynamicSetupTableScreenComponent } from './components/dynamic-setup-table-screen/dynamic-setup-table-screen.component';
import { DynamicSetupWizardWelcomeScreenComponent } from './components/dynamic-setup-wizard-welcome-screen/dynamic-setup-wizard-welcome-screen.component';
import { NgxSpinnerModule } from 'ngx-spinner';
export { Logger, LogLevel } from './services/logger/logger.service';
export { untilDestroyed } from './services/until-destroyed';
export { UtilService } from './services/util/util.service';
// export { JwtService } from './services/jwt.service';
export { RoleGuard, AuthGuard } from './services/guard';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFilterPipe } from './pipes/custom-filter/custom-filter.pipe';
import { SafeResourceUrlPipe } from './pipes/safe-resource-url/safe-resource-url.pipe';
import { ShareModalComponent } from './components/share-modal/share-modal.component';
import { DownloadModalComponent } from './components/download-modal/download-modal.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CountryService } from './services/setups/country/country.service';
import { TabMenuModule } from 'primeng/tabmenu';
import { SentenceCasePipe } from './pipes/sentence-case/sentence-case.pipe';
import { CommaformatDirective } from './directives/comma-format.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductPipe } from '../features/lms/pipe/product/product.pipe';
import { BeneficiaryPipe } from '../features/lms/pipe/beneficiary/beneficiary.pipe';
import { CoverTypePipe } from '../features/lms/pipe/cover-type/cover-type.pipe';
import { CountryPipe } from '../features/lms/pipe/country/country.pipe';
import { RelationTypePipe } from '../features/lms/pipe/relation-type/relation-type.pipe';
import { Error401Interceptor } from './services/http/error-404.interceptor';
import { Angular4PaystackModule } from 'angular4-paystack';




import { ReusableInputComponent } from './components/reusable-input/reusable-input.component';
import { DiseasePipe } from '../features/lms/pipe/disease/disease.pipe';
// import { TenantIdInterceptor } from './services/http/tenant-id.interceptor';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { QuotationLandingScreenComponent } from './components/quotation-landing-screen/quotation-landing-screen.component';
import { TabViewModule } from 'primeng/tabview';
import { ProposalLandingScreenComponent } from './components/proposal-landing-screen/proposal-landing-screen.component';
import { PolicyLandingScreenComponent } from './components/policy-landing-screen/policy-landing-screen.component';
import { SortPipe } from './pipes/sort/sort.pipe';
import { FileUploadModule } from 'primeng/fileupload';
import { PolicyModule } from '../features/lms/grp/components/policy/policy.module';
import { NationalityPipe } from '../features/lms/pipe/nationality/nationality.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {DynamicDocumentModalComponent} from "./components/dynamic-document-modal/dynamic-document-modal.component";




export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}
const lms_pipes = [BeneficiaryPipe, RelationTypePipe, ProductPipe, CoverTypePipe, DiseasePipe, SortPipe, CountryPipe, NationalityPipe];
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

  {
    provide: HTTP_INTERCEPTORS,
    useClass: Error401Interceptor,
    multi: true,
  },
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: TenantIdInterceptor,
  //   multi: true,
  // },
  // provide logger
  { provide: BrowserStorage, useClass: LocalBrowserStorageService },
  AuthService,
  MessageService,
  ConfirmationService,
  CookieService,
  ApiErrorInterceptor,
  CacheInterceptor,
  LoaderInterceptor,
  TokenInterceptor,
  HttpCacheService,
  JwtService,
  LoaderService,
  CountryService,
  { provide: BrowserStorage, useClass: LocalBrowserStorageService },

  // interceptors
  { provide: HttpClient, useClass: HttpService },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IeCacheControlInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true },
  ApiErrorInterceptor,
  CacheInterceptor,
  LoaderInterceptor,
  TokenInterceptor,

  {
    provide: APP_BASE_HREF,
    useFactory: getBaseHref,
    deps: [PlatformLocation],
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
    DynamicFormComponent,
    DynamicBreadcrumbComponent,
    StepperComponent,
    VerticalStepperComponent,
    HorizontalStepperComponent,
    DynamicSetupFormScreenComponent,
    DynamicSetupSearchListScreenComponent,
    DynamicSimpleModalComponent,
    DynamicFormModalComponent,
    DynamicSetupTableScreenComponent,
    DynamicSetupWizardWelcomeScreenComponent,
    CustomFilterPipe,
    SafeResourceUrlPipe,
    ShareModalComponent,
    DownloadModalComponent,
    CommaformatDirective,
    SentenceCasePipe,
    CommaformatDirective,
    ...lms_pipes,
    ReusableInputComponent,
    LanguageSelectorComponent,
    QuotationLandingScreenComponent,
    ProposalLandingScreenComponent,
    PolicyLandingScreenComponent,
    DynamicDocumentModalComponent,

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
        ChartModule,
        RouterLink,
        NgxSpinnerModule,
        TranslateModule,
        ReactiveFormsModule,
        CalendarModule,
        DropdownModule,
        HttpClientModule,
        NgbModule,
        Angular4PaystackModule.forRoot('pk_test_0a4f9771cb31dca0d30080264605a86ca6f8e0a2'),
        TabViewModule,
        FileUploadModule,
        PolicyModule,
        PdfViewerModule
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
    VerticalStepperComponent,
    HorizontalStepperComponent,
    DynamicFormComponent,
    DynamicBreadcrumbComponent,
    StepperComponent,
    DynamicSimpleModalComponent,
    DynamicFormModalComponent,
    NgxSpinnerModule,
    DynamicSetupSearchListScreenComponent,
    TranslateModule,
    DynamicSetupWizardWelcomeScreenComponent,
    ReactiveFormsModule,
    CustomFilterPipe,
    SafeResourceUrlPipe,
    CalendarModule,
    TableModule,
    DropdownModule,
    TabMenuModule,
    ShareModalComponent,
    DownloadModalComponent,
    CommaformatDirective,
    SentenceCasePipe,
    NgbModule,
    ...lms_pipes,
    ReusableInputComponent,
    Angular4PaystackModule,
    LanguageSelectorComponent,
    QuotationLandingScreenComponent,
    TabViewModule,
    PolicyLandingScreenComponent,
    ProposalLandingScreenComponent,
    FileUploadModule,
    PdfViewerModule,
    DynamicDocumentModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [...SERVICES],
    };
  }
}
