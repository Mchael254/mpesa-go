import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReportsComponent } from './my-reports.component';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { createSpyObj } from 'jest-createspyobj';
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {AccountContact} from "../../../shared/data/account-contact";
import {ClientAccountContact} from "../../../shared/data/client-account-contact";
import {WebAdmin} from "../../../shared/data/web-admin";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {ReportService} from "../services/report.service";
import {ReactiveFormsModule} from "@angular/forms";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}

export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<AccountContact | ClientAccountContact | WebAdmin>({} as AccountContact | ClientAccountContact | WebAdmin);
  public currentUser$: Observable<AccountContact | ClientAccountContact | WebAdmin> = this.currentUserSubject.asObservable().pipe(shareReplay());
  getCurrentUser(): AccountContact | ClientAccountContact | WebAdmin {
    return this.currentUserSubject.value;
  }
}

describe('MyReportsComponent', () => {

  const routerStub = { url: `http://localhost:4200/home/reports/my-reports` }
  const reportServiceStub = createSpyObj('ReportService', [
    'getReports',
  ]);

  let component: MyReportsComponent;
  let fixture: ComponentFixture<MyReportsComponent>;

  let appConfigService: AppConfigService;
  let authService: AuthService;
  let reportService: ReportService;

  let router: Router;

  const report = {
    id: 123,
    backgroundColor: 'test',
    borderColor: 'test',
    dashboardId: 123,
    folderId: 123,
    reportDescription: 'test',
    reportName: 'test',
    reportType: 'test',
    userId: 123,
    criteria: '',
    active: true
  }

  beforeEach(() => {

    jest.spyOn(reportServiceStub, 'getReports' ).mockReturnValue(of([report]))

    TestBed.configureTestingModule({
      declarations: [MyReportsComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ReportService, useValue: reportServiceStub },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(MyReportsComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(AppConfigService);
    authService = TestBed.inject(AuthService);
    reportService = TestBed.inject(ReportService)
    router = TestBed.inject(Router);

    component.user = {id: 123}

    fixture.detectChanges();
  });

  test ('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should select report', () => {
    component.reports$ = of([report])
    fixture.detectChanges()
    const button = fixture.debugElement.nativeElement.querySelector('#selectReport');
    button.click();
    expect(component.viewReport.call).toBeTruthy();
    expect(component.selectedReport).toEqual(report);
  })

  /*test('should view report', () => {
    component.reports$ = of([report])
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('#viewReport');
    button.click();
    expect(component.viewReport.call).toBeTruthy();
  })*/

});
