import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ClientTypeService } from './client-type.service';
import { AppConfigService } from '../../../../core/config/app-config-service';

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        accounts_services: 'crm',
        users_services: 'user',
        auth_services: 'oauth',
      },
    };
  }
}

describe('ClientTypeService', () => {
  let service: ClientTypeService;
  let appConfigServiceStub: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ],
    });
    service = TestBed.inject(ClientTypeService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
