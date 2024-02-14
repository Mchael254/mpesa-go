import { TestBed } from '@angular/core/testing';

import { ReinsuranceService } from './reinsurance.service';

describe('ReinsuranceService', () => {
  let service: ReinsuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReinsuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
