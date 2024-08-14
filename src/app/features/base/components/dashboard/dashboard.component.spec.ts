import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserStorage} from "../../../../shared/services/storage";
import {AuthService} from "../../../../shared/services/auth.service";
import {TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {createSpyObj} from "jest-createspyobj";
import {of, throwError} from "rxjs";
import {EntityService} from "../../../entities/services/entity/entity.service";
import {AppConfigService} from "../../../../core/config/app-config-service";
import cubejs from "@cubejs-client/core";
import {ReportService} from "../../../reports/services/report.service";
import {ReportServiceV2} from "../../../reports-v2/services/report.service";


export class MockAuthService {
  getCurrentUser = jest.fn().mockReturnValue({ userName: 'GISADMIN'})
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
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

export class MockCubeJsApi {
  load() {
    return {}
  }
}



describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const entityServiceStub = createSpyObj('EntityService',
    ['fetchGisPoliciesByUser', 'fetchGisQuotationsByUser']);

  const reportServiceStub = createSpyObj('ReportService', [
    'generateReportDatasets',
  ]);

  const reportServiceStub2 = createSpyObj('ReportServiceV2', [
    'getReports',
  ]);

  const transaction = {
    _embedded:
      [
        {
          quotation_no: 100,
          client_name: 'Test Client',
          sum_insured: 25000,
          premium: 2500,
          intermediary: 'Agent',
          date_created: '08-08-2024',
          cover_from: '08-08-2024',
          cover_to: '08-08-2024',
          status: 'A',
          currency: 'KES'
        }
      ]
  };
  const reports = {
    content: [
      {
        name: 'report 1', type: 'bar',
        charts: [],
        dimensions: "[{\"category\":\"whofilters\",\"categoryName\":\"Who Filters\",\"subcategory\":\"Agent\",\"subCategoryName\":\"Intermediary\",\"transaction\":\"General_Insurance_Agents\",\"query\":\"agentName\",\"queryName\":\"Agent Name\"}]",
        measures: "[{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"yAgoPremium\",\"queryName\":\"Year Ago Premium\"},{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"newBusinessPremium\",\"queryName\":\"New Business Premium\"}]"
      },
      {
        name: 'report 1', type: 'bar',
        charts: [],
        dimensions: "[{\"category\":\"whofilters\",\"categoryName\":\"Who Filters\",\"subcategory\":\"Agent\",\"subCategoryName\":\"Intermediary\",\"transaction\":\"General_Insurance_Agents\",\"query\":\"agentName\",\"queryName\":\"Agent Name\"}]",
        measures: "[{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"yAgoPremium\",\"queryName\":\"Year Ago Premium\"},{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"newBusinessPremium\",\"queryName\":\"New Business Premium\"}]"
      },
      {
        name: 'report 1', type: 'bar',
        charts: [],
        dimensions: "[{\"category\":\"whofilters\",\"categoryName\":\"Who Filters\",\"subcategory\":\"Agent\",\"subCategoryName\":\"Intermediary\",\"transaction\":\"General_Insurance_Agents\",\"query\":\"agentName\",\"queryName\":\"Agent Name\"}]",
        measures: "[{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"yAgoPremium\",\"queryName\":\"Year Ago Premium\"},{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"newBusinessPremium\",\"queryName\":\"New Business Premium\"}]"
      },
      {
        name: 'report 1', type: 'bar',
        charts: [],
        dimensions: "[{\"category\":\"whofilters\",\"categoryName\":\"Who Filters\",\"subcategory\":\"Agent\",\"subCategoryName\":\"Intermediary\",\"transaction\":\"General_Insurance_Agents\",\"query\":\"agentName\",\"queryName\":\"Agent Name\"}]",
        measures: "[{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"yAgoPremium\",\"queryName\":\"Year Ago Premium\"},{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"newBusinessPremium\",\"queryName\":\"New Business Premium\"}]"
      },
      {
        name: 'report 1', type: 'bar',
        charts: [],
        dimensions: "[{\"category\":\"whofilters\",\"categoryName\":\"Who Filters\",\"subcategory\":\"Agent\",\"subCategoryName\":\"Intermediary\",\"transaction\":\"General_Insurance_Agents\",\"query\":\"agentName\",\"queryName\":\"Agent Name\"}]",
        measures: "[{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"yAgoPremium\",\"queryName\":\"Year Ago Premium\"},{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"newBusinessPremium\",\"queryName\":\"New Business Premium\"}]"
      },
      {
        name: 'report 1', type: 'bar',
        charts: [],
        dimensions: "[{\"category\":\"whofilters\",\"categoryName\":\"Who Filters\",\"subcategory\":\"Agent\",\"subCategoryName\":\"Intermediary\",\"transaction\":\"General_Insurance_Agents\",\"query\":\"agentName\",\"queryName\":\"Agent Name\"}]",
        measures: "[{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"yAgoPremium\",\"queryName\":\"Year Ago Premium\"},{\"category\":\"metrics\",\"categoryName\":\"Metrics\",\"subcategory\":\"premiumAmounts\",\"subCategoryName\":\"Premium Amounts\",\"transaction\":\"General_Policy_Transactions\",\"query\":\"newBusinessPremium\",\"queryName\":\"New Business Premium\"}]"
      },
    ]
  };

  beforeEach(() => {
    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByUser')
      .mockReturnValue(of(transaction));

    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByUser')
      .mockReturnValue(of(transaction));

    jest.spyOn(reportServiceStub, 'generateReportDatasets' ).mockReturnValue(of({}));
    jest.spyOn(reportServiceStub2, 'getReports' ).mockReturnValue(of(reports));

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: cubejs, useClass: MockCubeJsApi },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: EntityService, useValue: entityServiceStub },
        { provide: ReportService, useValue: reportServiceStub },
        { provide: ReportServiceV2, useValue: reportServiceStub2 },
        // BrowserStorage
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.user.userName).toBe('GISADMIN');
    expect(component.fetchGisPoliciesByUser.call).toBeTruthy();
    expect(component.fetchGisQuotationsByUser.call).toBeTruthy();
  });

  afterAll(() => {
    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByUser')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByUser')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(reportServiceStub2, 'getReports')
      .mockReturnValue(throwError({ status: 404 }));

    component.ngOnInit();
  });
});
