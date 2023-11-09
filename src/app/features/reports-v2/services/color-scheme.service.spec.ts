import { TestBed } from '@angular/core/testing';

import { ColorSchemeService } from './color-scheme.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {AppConfigService} from "../../../core/config/app-config-service";
import { ColorScheme } from 'src/app/shared/data/reports/color-scheme';


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

describe('ColorSchemeService', () => {
  let service: ColorSchemeService;
  let appConfigService: AppConfigService;
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ],
    });
    service = TestBed.inject(ColorSchemeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should create color scheme', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    const colorScheme: ColorScheme = {
      name: 'Test color scheme',
      colors: ['red', 'orange'],
      id: 123,
    }

    service.createColorScheme(colorScheme).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(colorScheme);
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/color-schemes`);
    expect(req.request.method).toEqual('POST');
    req.flush(colorScheme);
  });


  test('should get all color schemes', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    const colorSchemes: ColorScheme[] = [{
      name: 'Test color scheme',
      colors: ['red', 'orange', 'green'],
      id: 123,
    }]

    service.fetchAllColorSchemes().subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(colorSchemes);
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/color-schemes`);
    expect(req.request.method).toEqual('GET');
    req.flush(colorSchemes);
  });

  test('should delete color scheme', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;
    const colorScheme: ColorScheme = {
      name: 'Test color scheme',
      colors: ['red', 'orange', 'green'],
      id: 123,
    }

    service.deleteColorScheme(colorScheme.id).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(colorScheme);
    });

    const req = httpTestingController.expectOne(`/${baseUrl}/chart/color-schemes/123`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(colorScheme);
  });

});
