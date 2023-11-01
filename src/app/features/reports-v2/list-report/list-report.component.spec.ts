import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReportComponent } from './list-report.component';
import {AppConfigService} from "../../../core/config/app-config-service";
import {ReportService} from "../../reports/services/report.service";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerModule, NgxSpinnerService} from "ngx-spinner";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {Logger, UtilService} from "../../../shared/services";
import {of} from "rxjs";
import cubejs from "@cubejs-client/core";
import {MessageService} from "primeng/api";
import {DynamicBreadcrumbComponent} from "../../../shared/components/dynamic-breadcrumb/dynamic-breadcrumb.component";
import {MenuModule} from "primeng/menu";
import {AddReportToDashDTO, DashboardReports} from "../../../shared/data/reports/dashboard";

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
  deleteReportFromDashboard = jest.fn().mockReturnValue(of());
  getDashboardsById = jest.fn().mockReturnValue(of());
}

export class MockCubeJsApi {
  load() {
    return {}
  }
}

describe('ListReportComponent', () => {
  let component: ListReportComponent;
  let fixture: ComponentFixture<ListReportComponent>;

  let appConfigServiceStub: AppConfigService;
  let reportServiceStub: ReportService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let spinnerStub: NgxSpinnerService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListReportComponent,
        DynamicBreadcrumbComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MenuModule,
        NgxSpinnerModule.forRoot(),
        ],
      providers: [
        GlobalMessagingService,
        UtilService,
        MessageService,
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ReportService, useClass: MockReportService },
        { provide: cubejs, useClass: MockCubeJsApi },
      ],
    });
    fixture = TestBed.createComponent(ListReportComponent);
    component = fixture.componentInstance;
    appConfigServiceStub = TestBed.inject(AppConfigService);
    reportServiceStub = TestBed.inject(ReportService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    spinnerStub = TestBed.inject(NgxSpinnerService);
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove report from dashboard', () => {
    const selectedReport = 456;
    const selectedDashboard = 123;

    component.ngOnInit();
    component.removeFromDashboard();
    const deleteReportFromDashboardSpy = jest.spyOn(reportServiceStub, 'deleteReportFromDashboard').mockReturnValue(of());
    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const report: DashboardReports[] = [{
      length: 0,
      order: 0,
      reportId: null,
      width: 0
    }];

    const deleteDashboard: AddReportToDashDTO = {
      dashboardId: null,
      dashboardReports: report
    }
    expect(deleteReportFromDashboardSpy).toHaveBeenCalledWith(null, deleteDashboard);
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith(
      'Success',
      'Report successfully removed from dashboard'
    );
    expect(component.getDashboardById).toHaveBeenCalledWith(selectedDashboard);
    expect(fixture.detectChanges).toHaveBeenCalled();
  });

  it('should retrieve dashboard by ID', () => {
    const id = 123;

    component.ngOnInit();
    component.getDashboardById(id)


    expect(reportServiceStub.getDashboardsById).toHaveBeenCalledWith(id);
    expect(loggerSpy).toHaveBeenCalled();
    // expect(spinnerStub.hide).toHaveBeenCalled();
  });
});
