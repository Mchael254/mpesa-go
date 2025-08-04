import { TestBed } from '@angular/core/testing';

import { DynamicScreensSetupService } from './dynamic-screens-setup.service';

describe('DynamicScreensSetupService', () => {
  let service: DynamicScreensSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicScreensSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
