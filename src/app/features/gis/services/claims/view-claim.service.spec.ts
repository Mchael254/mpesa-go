import { TestBed } from '@angular/core/testing';

import { ViewClaimService } from './view-claim.service';

describe('ViewClaimService', () => {
  let service: ViewClaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewClaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
