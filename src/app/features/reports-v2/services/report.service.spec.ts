import { TestBed } from '@angular/core/testing';

import { ReportServiceV2 } from './report.service';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ReportV2} from "../../../shared/data/reports/report";

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

describe('ReportService', () => {
  let service: ReportServiceV2;
  let appConfigService: AppConfigService;
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ],
    });
    service = TestBed.inject(ReportServiceV2);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should create report', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    const report: ReportV2 = {
      charts: [],
      createdDate: "",
      dashboardId: 0,
      dimensions: "",
      folder: "",
      measures: "",
      name: ""
    }

    service.createReport(report).subscribe(report => {
      expect(report).toBeTruthy();
      expect(report).toBe(report);
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/chart-reports`);
    expect(req.request.method).toEqual('POST');
    req.flush(report);
  });

  test('should get report by Id', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    const report: ReportV2 = {
      charts: [],
      createdDate: "",
      dashboardId: 0,
      dimensions: "",
      folder: "",
      measures: "",
      name: "",
      id: 222
    }

    service.getReportById(report.id).subscribe(report => {
      expect(report).toBeTruthy();
      expect(report).toBe(report);
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/chart-reports/${report.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(report)
  });

  test('should fetch filter conditions', () => {
    service.fetchFilterConditions();
    expect(service.fetchFilterConditions.call).toBeTruthy();
  });

});
