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

  const report: ReportV2 = {
    charts: [],
    createdDate: "",
    dashboardId: 0,
    dimensions: "",
    folder: "S",
    measures: "",
    name: ""
  };

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
    jest.spyOn(reportServiceStubV2, 'getReports' ).mockReturnValue(of([report]));
    jest.spyOn(reportServiceStub, 'getDashboards' ).mockReturnValue(of(dashboards));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.getDashboards.call).toBeTruthy();
    expect(component.getReports.call).toBeTruthy();
  });

  test('should get folderCategoryName', () => {
    
  });

});
