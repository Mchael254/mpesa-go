import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDashboardComponent } from './report-dashboard.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppConfigService} from "../../../core/config/app-config-service";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {ReportService} from "../services/report.service";
import {createSpyObj} from "jest-createspyobj";
import {Report} from "../../../shared/data/reports/report";
import {Criteria} from "../../../shared/data/reports/criteria";

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

describe('ReportDashboardComponent', () => {

  const reportServiceStub = createSpyObj('ReportService', [
    'getReports',
  ]);

  let component: ReportDashboardComponent;
  let fixture: ComponentFixture<ReportDashboardComponent>;

  let appConfigService: AppConfigService;
  let reportService: ReportService;

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
    jest.spyOn(reportServiceStub, 'getReports' ).mockReturnValue(of([report, report2]))

    TestBed.configureTestingModule({
      declarations: [ReportDashboardComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ReportService, useValue: reportServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ReportDashboardComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(AppConfigService);
    reportService = TestBed.inject(ReportService)
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();

    expect(component.getReports.call).toBeTruthy();
    expect(component.getVisualizationQueries.call).toBeTruthy();
    expect(component.getDimensionsAndMeasures.call).toBeTruthy();
    expect(component.addReportToVisualizations.call).toBeTruthy();
    expect(component.addReportToVisualizations.call).toBeTruthy();

    expect(component.reports).toEqual([report, report2])
    expect(component.visualizationQueries.length).toEqual(2)

  });


});
