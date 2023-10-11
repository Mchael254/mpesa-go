import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPreviewComponent } from './report-preview.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {AccountContact} from "../../../shared/data/account-contact";
import {ClientAccountContact} from "../../../shared/data/client-account-contact";
import {WebAdmin} from "../../../shared/data/web-admin";
import {AuthService} from "../../../shared/services/auth.service";
import {MessageService} from "primeng/api";
import {AppConfigService} from "../../../core/config/app-config-service";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import {ReactiveFormsModule} from "@angular/forms";
import {createSpyObj} from "jest-createspyobj";
import {ReportService} from "../../reports/services/report.service";
import {ReportV2} from "../../../shared/data/reports/report";
import {ReportServiceV2} from "../services/report.service";
import cubejs, {CubejsApi} from "@cubejs-client/core";

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

export class MockSessionStorageService {

  criteria = [
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
  ];

  filter =
    {
      member: `General_Policy_Transactions.grossPremium`,
      operator: `gt`,
      values: ['1000000']
    };

  queryObject = {
    category: 'metrics',
    categoryName: 'Metrics',
    subcategory: 'premiumAmounts',
    subCategoryName: 'Premium Amounts',
    transaction: 'General_Policy_Transactions',
    query: 'yAgoPremium',
    queryName: 'Year Ago Premium',
    filter:'Gross Premium gt 1000000000'
  }



  setItem() {
    return null
  }

  getItem() {
    return {
      criteria: this.criteria,
      reportNameRec: 'Sample Report',
      filters: [{filter: this.filter, queryObject: this.queryObject}],
      sort: []
    }
  }

}

export class MockCubeJsApi {
  load() {
    return {}
  }
}

describe('ReportPreviewComponent', () => {
  const reportServiceStub = createSpyObj('ReportService', [
    'createReport', 'fetchFilterConditions'
  ]);

  let component: ReportPreviewComponent;
  let fixture: ComponentFixture<ReportPreviewComponent>;
  let authService: AuthService;
  let appConfigService: AppConfigService;

  const report: ReportV2 = {
    charts: [],
    createdDate: "",
    dashboardId: 0,
    dimensions: "",
    folder: "",
    measures: "",
    name: ""
  };

  const filterConditions = {
    metricConditions: [
      {label: 'Greater than', value: 'gt'},
      {label: 'Greater than or equal', value: 'gte'},
      {label: 'Lower than', value: 'lt'},
      {label: 'Lower than or equal', value: 'lte'},
      {label: 'Equals', value: 'equals'},
      {label: 'Not equals', value: 'notEquals'},
      {label: 'Between', value: 'between'},
    ],

    dimensionConditions:[
      {label: 'Starts with', value: 'startsWith'},
      {label: 'Contains', value: 'contains'},
      {label: 'Not contains', value: 'notContains'},
      {label: 'Ends with', value: 'endsWith'},
    ],

    dateConditions: [
      {label: 'In date range', value: 'inDateRange'},
      {label: 'Not in date range', value: 'inDateRange'},
      {label: 'Before date', value: 'beforeDate'},
      {label: 'After date', value: 'afterDate'},
    ],
  }

  beforeEach(() => {
    jest.spyOn(reportServiceStub, 'createReport' ).mockReturnValue(of(report));
    jest.spyOn(reportServiceStub, 'fetchFilterConditions' ).mockReturnValue(filterConditions);

    TestBed.configureTestingModule({
      declarations: [ReportPreviewComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        MessageService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: SessionStorageService, useClass: MockSessionStorageService },
        { provide: ReportServiceV2, useValue: reportServiceStub },
        { provide: cubejs, useClass: MockCubeJsApi },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ReportPreviewComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    appConfigService = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.createFilterForm.call).toBeTruthy();
    expect(component.createSaveReportForm.call).toBeTruthy();
    expect(component.loadChart.call).toBeTruthy();
  });

  test('should select chart type', () => {
    const visualizationBtn = fixture.debugElement.nativeElement.querySelector('.selected-visualization');
    visualizationBtn.click();
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('.chart-type');
    button.click();
    fixture.detectChanges();

    expect(component.chartType).toBe('table');
    expect(component.shouldShowTable).toBe(true);
    expect(component.shouldShowVisualization).toBe(false);
    expect(component.loadChart.call).toBeTruthy();
  })

  test('should add Filter', () => {
    const event = { target: { value: 'yAgoPremium' }}
    component.showConditions(event)
    component.filterForm.controls['column'].setValue('yAgoPremium');
    component.filterForm.controls['operator'].setValue('lt');
    component.filterForm.controls['value'].setValue(1000000);

    const button = fixture.debugElement.nativeElement.querySelector('#addFilterBtn');
    button.click();
    fixture.detectChanges();

    expect(component.selectedFilters.length).toBe(2);
  });

  test('should remove Filter', () => {
    component.selectedFilters = [
      {
        column: `yAgoPremium `,
        operator: 'lt',
        value: 1000000
      }
    ];
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('.remove-filter');
    button.click();
    fixture.detectChanges();

    expect(component.selectedFilters.length).toBe(0);
  });

  test('should save report', () => {
    component.saveReportForm.controls['reportName'].setValue('Sample report');
    component.saveReportForm.controls['dashboard'].setValue(834);
    component.saveReportForm.controls['destination'].setValue('M');
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('#saveReportBtn');
    button.click();
    fixture.detectChanges();

    // write assertions
  });

  test('should go back to previous page', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#backBtn');
    button.click();
    fixture.detectChanges();
    // write assertions
  })

});
