import { TestBed } from '@angular/core/testing';

import { PayFrequencyService } from './pay-frequency.service';

describe('PayFrequencyService', () => {
  let service: PayFrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayFrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
