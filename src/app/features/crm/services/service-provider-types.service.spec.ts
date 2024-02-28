import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ServiceProviderTypesService } from './service-provider-types.service';
import { AppConfigService } from '../../../core/config/app-config-service';

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

describe('ServiceProviderTypesService', () => {
  let service: ServiceProviderTypesService;
  let appConfigServiceStub: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ],
    });
    service = TestBed.inject(ServiceProviderTypesService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
