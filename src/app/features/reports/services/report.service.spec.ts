import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ParametersService} from "../../gis/components/setups/services/parameters/parameters.service";

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
  let service: ReportService;
  let appConfigService: AppConfigService;
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ParametersService,
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    service = TestBed.inject(ReportService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should get subject areas', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    service.getSubjectAreas().subscribe(subjectAreas => {
      expect(subjectAreas).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/charts/subject-areas`);
    expect(req.request.method).toEqual('GET');
    req.flush([])
  });

  test('should get categories by subject area id', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    service.getCategoriesBySubjectAreaId(111).subscribe(subjectAreas => {
      expect(subjectAreas).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/charts/categories/111`);
    expect(req.request.method).toEqual('GET');
    req.flush({})
  });

  test('should get reports', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    service.getReports().subscribe(subjectAreas => {
      expect(subjectAreas).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/charts`);
    expect(req.request.method).toEqual('GET');
    req.flush([])
  });

});
