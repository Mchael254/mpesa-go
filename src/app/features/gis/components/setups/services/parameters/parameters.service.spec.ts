import { TestBed } from '@angular/core/testing';

import { ParametersService } from './parameters.service';
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Params} from "../../data/gisDTO";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth",
        "gis_services": "gis"
      },
    };
  }
}

describe('ParametersService', () => {
  let service: ParametersService;
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
    service = TestBed.inject(ParametersService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should get all params', () => {
    const baseUrl = appConfigService.config.contextPath.gis_services;
    service.getAllParams().subscribe(params => {
      expect(params).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/setups/api/v1/system-parameters?pageSize=100`);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
  });

  test('should get param', () => {
    const baseUrl = appConfigService.config.contextPath.gis_services;
    service.getParam(100).subscribe(param => {
      expect(param).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/setups/api/v1/system-parameters/100`);
    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  test('should create param', () => {
    const paramToCreate: Params = {
      description: 'TESt',
      name: 'TESt',
      organizationCode: 2,
      status: 'Active',
      value: 'TESt',
      version: 0,
    }
    const baseUrl = appConfigService.config.contextPath.gis_services;
    service.createParam(paramToCreate).subscribe(param => {
      expect(param).toBeTruthy();
    });
    const req = httpTestingController.expectOne(`/${baseUrl}/setups/api/v1/system-parameters`);
    expect(req.request.method).toEqual('POST');
    req.flush(paramToCreate);
  });

  test('should update param', () => {
    const paramToCreate: Params = {
      description: 'TESt',
      name: 'TESt',
      organizationCode: 2,
      status: 'Active',
      value: 'TESt',
      version: 0,
    }
    const baseUrl = appConfigService.config.contextPath.gis_services;
    service.updateParam(paramToCreate, 202).subscribe(param => {
      expect(param).toBeTruthy();
    });
    const req = httpTestingController.expectOne(`/${baseUrl}/setups/api/v1/system-parameters/202`);
    expect(req.request.method).toEqual('PUT');
    req.flush(paramToCreate);
  });

});
