import { TestBed } from '@angular/core/testing';

import { ShortPeriodService } from './short-period.service';

describe('ShortPeriodService', () => {
  let service: ShortPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
