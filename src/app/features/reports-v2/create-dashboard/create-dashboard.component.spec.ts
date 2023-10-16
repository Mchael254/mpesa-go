import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDashboardComponent } from './create-dashboard.component';
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MessageService} from "primeng/api";
import {DropdownModule} from "primeng/dropdown";
import {DynamicChartComponent} from "../../../shared/components/dynamic-chart/dynamic-chart.component";
import {MenuModule} from "primeng/menu";
import {BrowserStorage} from "../../../shared/services/storage";
import {AuthService} from "../../../shared/services/auth.service";
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {AccountContact} from "../../../shared/data/account-contact";
import {ClientAccountContact} from "../../../shared/data/client-account-contact";
import {WebAdmin} from "../../../shared/data/web-admin";
import {Logger, UtilService} from "../../../shared/services";
import cubejs from "@cubejs-client/core";
import {AppConfigService} from "../../../core/config/app-config-service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReportService} from "../../reports/services/report.service";
import {MultiSelectModule} from "primeng/multiselect";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {Pagination} from "../../../shared/data/common/pagination";

import {Router} from "@angular/router";

export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<AccountContact | ClientAccountContact | WebAdmin>({} as AccountContact | ClientAccountContact | WebAdmin);
  public currentUser$: Observable<AccountContact | ClientAccountContact | WebAdmin> = this.currentUserSubject.asObservable().pipe(shareReplay());
  getCurrentUser(): AccountContact | ClientAccountContact | WebAdmin {
    return this.currentUserSubject.value;
  }
}

export class MockCubeJsApi {
  load() {
    return {}
  }
}

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
      cubejsDefaultUrl: `http://10.176.18.211:4000/cubejs-api/v1`
    };
  }
}

export class MockReportService {
  saveDashboard = jest.fn().mockReturnValue(of());
  deleteDashboard = jest.fn().mockReturnValue(of());
  generateReportDatasets = jest.fn().mockReturnValue(of());
  getChartReports = jest.fn().mockReturnValue(of());
  getDashboards = jest.fn().mockReturnValue(of());
}
describe('CreateDashboardComponent', () => {
  let component: CreateDashboardComponent;
  let fixture: ComponentFixture<CreateDashboardComponent>;

  let globalMessagingServiceStub: GlobalMessagingService;
  let authServiceStub: AuthService;
  let utilServiceStub: UtilService;
  let appConfigServiceStub: AppConfigService;
  let reportServiceStub: ReportService;
  let loggerSpy: jest.SpyInstance;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateDashboardComponent,
        DynamicChartComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        DropdownModule,
        MenuModule,
        MultiSelectModule,
        ReactiveFormsModule,
        FormsModule,
        ],
      providers: [
        GlobalMessagingService,
        MessageService,
        BrowserStorage,
        UtilService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: cubejs, useClass: MockCubeJsApi },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ReportService, useClass: MockReportService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CreateDashboardComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    utilServiceStub = TestBed.inject(UtilService);
    authServiceStub = TestBed.inject(AuthService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
    reportServiceStub = TestBed.inject(ReportService);
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should create a dashboard', () => {
    /!*component.onCreateDashboard.call(
      {
        // createDashboardForm: mockCreateDashboardForm,
        authService: MockAuthService,
        // utilService: mockUtilService,
        reportService: MockReportService,
        // globalMessagingService: mockGlobalMessagingService,
        // cdr: mockCdr,
      },
      // mockLog
    );*!/
    component.onCreateDashboard();
    component.createDashForm();
    const yourField1Control = component.createDashboardForm.controls;
    yourField1Control['dashboardName'].setValue('Test Dash');
    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    const reportServiceSpy = jest.spyOn(reportServiceStub, "saveDashboard");
    const uServiceSpy = jest.spyOn(reportServiceStub, "saveDashboard");

    // expect(mockCreateDashboardForm.getRawValue).toHaveBeenCalled();
    // expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    // expect(mockUtilService.isUserAdmin).toHaveBeenCalled();

    expect(yourField1Control['dashboardName'].valid).toBeTruthy();
    expect(reportServiceSpy).toHaveBeenCalled();
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith(
      'Success',
      'Successfully Created Dashboard'
    );
    expect(fixture.detectChanges).toHaveBeenCalled();
  });*/


  it('should add a report', () => {
    component.addReport();

    const modal = document.getElementById('addReportModal');
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];

    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
    // expect(modalBackdrop.classList.contains('show')).toBeTruthy();
  });
  it('should close the add report modal', () => {
    component.closeAddReportModal();

    const closedModal = document.getElementById('addReportModal');
    const closedModalBackdrop = document.getElementsByClassName('modal-backdrop')[0];

    expect(closedModal.classList.contains('show')).toBeFalsy();
    expect(closedModal.style.display).toBe('none');
    // expect(closedModalBackdrop.classList.contains('show')).toBeFalsy();
  });

  it('should close the delete report modal', () => {
    component.closeDeleteModal();

    const closedModal = document.getElementById('deleteDashboardModal');
    const closedModalBackdrop = document.getElementsByClassName('modal-backdrop')[0];

    expect(closedModal.classList.contains('show')).toBeFalsy();
    expect(closedModal.style.display).toBe('none');
    // expect(closedModalBackdrop.classList.contains('show')).toBeFalsy();
  });

  it('should delete a dashboard', () => {
    const selectedItem = null;

    component.deleteDashboard(selectedItem);
    const button = fixture.debugElement.nativeElement.querySelector('#deleteDashboard');
    button.click();
    fixture.detectChanges();

    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    const reportServiceSpy = jest.spyOn(reportServiceStub, 'deleteDashboard');

    expect(reportServiceStub.deleteDashboard).toHaveBeenCalledWith(selectedItem);
    // expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', 'Report Deleted');
    // expect(fixture.detectChanges).toHaveBeenCalled();
  });

  it('should get chart reports', () => {
    component.ngOnInit();
    jest.spyOn(reportServiceStub, 'getChartReports').mockReturnValue(of());
    component.getChartReports();
     let reports: Pagination<any>

    expect(reportServiceStub.getChartReports().subscribe((data) =>{
      reports= data;
    })).toBeTruthy();
    // expect(loggerSpy).toHaveBeenCalledWith(`all chart reports >>>,`);
  });
  it('should navigate to list report', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const expectedRoute = 'home/reportsv2/list-report';
    const id = 1
    component.moveToListReport(id);

    expect(navigateSpy).toHaveBeenCalledWith([expectedRoute],
      {"queryParams": {"dashboardId": 1}});
  });

  it('should add report to a dashboard', () => {

    component.addReportToDashboard();

    const reportToDashForm = component.addReportToDashboardForm.getRawValue();
    let selectedReports = reportToDashForm.reportName;

    const button = fixture.debugElement.nativeElement.querySelector('#addReport');
    button.click();
    fixture.detectChanges();

    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    const reportServiceSpy = jest.spyOn(reportServiceStub, 'addReportToDashboard');

    expect(reportServiceStub.addReportToDashboard).toHaveBeenCalled();
    // expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', 'Report Deleted');
    // expect(fixture.detectChanges).toHaveBeenCalled();
  });
});
