import { TestBed } from '@angular/core/testing';

import { GlobalMessagingService } from './global-messaging.service';

describe('GlobalMessagingService', () => {
  let service: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
