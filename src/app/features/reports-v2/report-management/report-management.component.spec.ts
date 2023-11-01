import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManagementComponent } from './report-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {AppConfigService} from "../../../core/config/app-config-service";
import {ReportV2} from "../../../shared/data/reports/report";
import {createSpyObj} from "jest-createspyobj";
import { of } from 'rxjs';
import { ReportService } from '../../reports/services/report.service';
import { ReportServiceV2 } from '../services/report.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

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

describe('ReportManagementComponent', () => {

  const reportServiceStub = createSpyObj('ReportService', [
    'getDashboards'
  ]);

  const reportServiceStubV2 = createSpyObj('ReportServiceV2', [
    'getReports',
  ]);

  let component: ReportManagementComponent;
  let fixture: ComponentFixture<ReportManagementComponent>;
  let appConfigService: AppConfigService;

  const report: ReportV2 = {
    charts: [],
    createdDate: "2023-09-26",
    createdBy: 834,
    dashboardId: 0,
    dimensions: "",
    folder: "S",
    measures: "",
    name: "Sample report",
    id: 123,
  };

  const reports = {
    content: [report, report],
    totalPages: 1,
    last: true,
    size: 25,
    number: 0,
    sort: {
        empty: true,
        sorted: false,
        unsorted: true
    },
    numberOfElements: 2,
    first: true,
    empty: false
  }

  const dashboards = [
    {
      id: 123456,
      createdBy: 834,
      createdDate: '2023-10-11',
      reports: [],
      name: 'Tesing dashboard'
    }
  ]

  beforeEach(() => {
    jest.spyOn(reportServiceStubV2, 'getReports' ).mockReturnValue(of(reports));
    jest.spyOn(reportServiceStub, 'getDashboards' ).mockReturnValue(of(dashboards));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: ReportService, useValue: reportServiceStub },
        { provide: ReportServiceV2, useValue: reportServiceStubV2 },

      ],
      declarations: [ReportManagementComponent],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
    fixture = TestBed.createComponent(ReportManagementComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.getDashboards.call).toBeTruthy();
    expect(component.getReports.call).toBeTruthy();
  });

  // test('should get folderCategoryName', () => {
    
  // });

  test('should re-assign a report folder', () => {
    // const button = fixture.debugElement.nativeElement.querySelector('.reAssignReport');
    // button.click();
    // fixture.detectChanges();
  });

  test('should re-assign a report dashboard', () => {
    // const button = fixture.debugElement.nativeElement.querySelector('.reAssignReportDashboard');
    // button.click();
    // fixture.detectChanges();
  });

});
