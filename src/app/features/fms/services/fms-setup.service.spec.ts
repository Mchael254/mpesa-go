import { TestBed } from '@angular/core/testing';

import { FmsSetupService } from './fms-setup.service';

describe('FmsSetupService', () => {
  let service: FmsSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FmsSetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
