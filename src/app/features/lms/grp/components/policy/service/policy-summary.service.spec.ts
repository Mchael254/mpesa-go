import { TestBed } from '@angular/core/testing';

import { PolicySummaryService } from './policy-summary.service';

describe('PolicySummaryService', () => {
  let service: PolicySummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicySummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
