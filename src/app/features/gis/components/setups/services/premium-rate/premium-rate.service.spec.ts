import { TestBed } from '@angular/core/testing';

import { PremiumRateService } from './premium-rate.service';

describe('PremiumRateService', () => {
  let service: PremiumRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
