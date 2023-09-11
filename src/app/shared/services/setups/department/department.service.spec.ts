import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {DepartmentDto} from "../../../data/common/departmentDto";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AuthService} from "../../auth.service";
import {BrowserStorage} from "../../storage";
import {APP_BASE_HREF} from "@angular/common";
import {UtilService} from "../../util/util.service";
import {JwtService} from "../../jwt/jwt.service";
import {Router} from "@angular/router";
import {MockUtilService} from "../../auth.service.spec";
import {of} from "rxjs";

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
describe('DepartmentService', () => {
  let service: DepartmentService;
  let appConfigService: AppConfigService;
  let httpTestingController: HttpTestingController;

  let mockDepartments : DepartmentDto[]  = [
    {
      id: 1,
      departmentName: 'IT',
      shortDescription: 'IT',
      organizationId: 2,
      effectiveFromDate: null,
      effectiveToDate: null
    },
    {
      id: 2,
      departmentName: 'Human Resource',
      shortDescription: 'HR',
      organizationId: 2,
      effectiveFromDate: null,
      effectiveToDate: null
    },
  ];

  let department : DepartmentDto = {
    id: 3,
    departmentName: 'Sales and Marketing',
    shortDescription: 'S&M',
    organizationId: 2,
    effectiveFromDate: null,
    effectiveToDate: null
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports:[ HttpClientTestingModule ],
      providers: [
        AuthService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    service = TestBed.inject(DepartmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should get all departments', () => {
    const baseUrl = appConfigService.config.contextPath.setup_services;
    jest.spyOn(service, 'getDepartments').mockReturnValue(of(mockDepartments));

    let departmentsObservable = service.getDepartments(2);
    const req = httpTestingController.expectOne(`/${baseUrl}/setups/departments`);
    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  test('should get a department by its ID', () => {
    const baseUrl = appConfigService.config.contextPath.setup_services;
    jest.spyOn(service, 'getDepartmentById').mockReturnValue(of(department));
    let departmentId = 2;

    let mockDepartment = service.getDepartmentById(2);

    const req = httpTestingController.expectOne(`/${baseUrl}/setups/departments/${departmentId}`);
    expect(service.getDepartmentById).toBeCalledWith(2);
    expect(req.request.method).toBe('GET');
    expect(of(mockDepartment)).toEqual(of(department));
    req.flush({});
  });

});
