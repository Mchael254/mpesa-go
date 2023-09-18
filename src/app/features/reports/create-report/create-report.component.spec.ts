import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportComponent } from './create-report.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {MessageService} from "primeng/api";
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {AccountContact} from "../../../shared/data/account-contact";
import {ClientAccountContact} from "../../../shared/data/client-account-contact";
import {WebAdmin} from "../../../shared/data/web-admin";
import {AuthService} from "../../../shared/services/auth.service";
import {RouterTestingModule} from "@angular/router/testing";
import {AppConfigService} from "../../../core/config/app-config-service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {createSpyObj} from "jest-createspyobj";
import {SubjectArea} from "../../../shared/data/reports/subject-area";
import {ReportService} from "../services/report.service";
import {Criteria} from "../../../shared/data/reports/criteria";
import {Report} from "../../../shared/data/reports/report";
import {DropdownModule} from "primeng/dropdown";


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

export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<AccountContact | ClientAccountContact | WebAdmin>({} as AccountContact | ClientAccountContact | WebAdmin);
  public currentUser$: Observable<AccountContact | ClientAccountContact | WebAdmin> = this.currentUserSubject.asObservable().pipe(shareReplay());
  getCurrentUser(): AccountContact | ClientAccountContact | WebAdmin {
    return this.currentUserSubject.value;
  }
}

export class MockActivatedRoute {
  testParams = {reportId: 1}
  queryParams = of(this.testParams)
  get snapshot() {
    return { params: this.testParams, queryParams: this.testParams };
  }
}

describe('CreateReportComponent', () => {
  const reportServiceStub = createSpyObj('ReportService', [
    'getReports', 'getSubjectAreas', 'getReports', 'getCategoriesBySubjectAreaId'
  ]);

  let component: CreateReportComponent;
  let fixture: ComponentFixture<CreateReportComponent>;

  let authService: AuthService;
  let appConfigService: AppConfigService;

  const subjectAreas: SubjectArea[] = [
    {
      id: 1,
      subjectAreaName: 'General Insurance Underwriting'
    }
  ];

  const criteria: Criteria[] = [
    {
      category: 'metrics',
      categoryName: 'Metrics',
      subcategory: 'premiumAmounts',
      subCategoryName: 'Premium Amounts',
      transaction: 'General_Policy_Transactions',
      query: 'yAgoPremium',
      queryName: 'Year Ago Premium',
    },
    {
      category: 'whofilters',
      categoryName: 'Who Filters',
      subcategory: 'agent',
      subCategoryName: 'Intermediary',
      transaction: 'General_Insurance_Agents',
      query: 'agentName',
      queryName: 'Agent Name',
    },
  ]

  const report: Report = {
    id: 1,
    backgroundColor: 'test',
    borderColor: 'test',
    dashboardId: 0,
    folderId: 123,
    reportDescription: 'test',
    reportName: 'test',
    reportType: 'test',
    userId: 123,
    criteria: JSON.stringify(criteria),
    active: true
  }

  const report2: Report = {
    id: 2,
    backgroundColor: 'test',
    borderColor: 'test',
    dashboardId: 0,
    folderId: 123,
    reportDescription: 'test',
    reportName: 'test',
    reportType: 'test',
    userId: 123,
    criteria: JSON.stringify(criteria),
    active: true
  }

  beforeEach(() => {
    jest.spyOn(reportServiceStub, 'getSubjectAreas' ).mockReturnValue(of(subjectAreas))
    jest.spyOn(reportServiceStub, 'getReports' ).mockReturnValue(of([report, report2]))
    jest.spyOn(reportServiceStub, 'getCategoriesBySubjectAreaId' ).mockReturnValue(of({}))

    TestBed.configureTestingModule({
      declarations: [CreateReportComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        DropdownModule,
      ],
      providers: [
        GlobalMessagingService,
        MessageService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute},
        { provide: ReportService, useValue: reportServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(CreateReportComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    appConfigService = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  test ('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should getCategoriesBySubjectAreaId', () => {
    const select = fixture.debugElement.nativeElement.querySelector('#subjectAreaDropdown');
  })


});
