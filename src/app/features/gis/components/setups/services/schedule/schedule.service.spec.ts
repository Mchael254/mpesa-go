import { TestBed } from '@angular/core/testing';

import { ScheduleService } from './schedule.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {ScreenCode} from "../../data/gisDTO";

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

describe('ScheduleService', () => {
  let service: ScheduleService;
  let appConfigService: AppConfigService;
  let httpTestingController: HttpTestingController

  const screenCode: ScreenCode = {
    claimScheduleReport: null,
    code: "TEST",
    coverSummaryName: null,
    endorsementSchedule: "",
    fleetName: null,
    helpContent: null,
    isScheduleRequired: "",
    level: "",
    numberOfRisks: null,
    organization_code: 0,
    policyDocumentName: null,
    policyDocumentRiskNoteName: null,
    policySchedule: null,
    renewalCertificates: null,
    renewalNotice: "",
    riskNoteName: null,
    riskReportName: "",
    scheduleReportName: "",
    screenId: 0,
    screenName: "",
    screenTitle: null,
    screenType: null,
    screen_description: "",
    showDefaultRisks: "",
    showSumInsured: "",
    version: 0,
    xmlNiskNoteName: null
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    service = TestBed.inject(ScheduleService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should get screenCodes', () => {
    const baseUrl = appConfigService.config.contextPath.gis_services;
    service.getAllScreenCodes().subscribe(screenCodes => {
      expect(screenCodes).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/setups/api/v1/screens?pageNo=0&pageSize=1000`);
    expect(req.request.method).toEqual('GET');
    req.flush([screenCode])
  });

  test('should updateScreenCode', () => {
    const baseUrl = appConfigService.config.contextPath.gis_services;
    service.updateScreenCode(screenCode).subscribe(screenCode => {
      expect(screenCode).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/setups/api/v1/screens/${screenCode.code}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(screenCode)
  });

  test('should createScreenCode', () => {
    const baseUrl = appConfigService.config.contextPath.gis_services;
    service.createScreenCode(screenCode).subscribe(screenCode => {
      expect(screenCode).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/setups/api/v1/screens`);
    expect(req.request.method).toEqual('POST');
    req.flush(screenCode)
  });

});
