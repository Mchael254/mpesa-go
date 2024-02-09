import { TestBed } from '@angular/core/testing';

import { ChannelService } from './channel.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppConfigService } from '../../../core/config/app-config-service';

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        setup_services: 'crm',
        users_services: 'user',
        auth_services: 'oauth',
      },
    };
  }
}

describe('ChannelService', () => {
  let service: ChannelService;
  let appConfigServiceStub: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ],
    });
    service = TestBed.inject(ChannelService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
