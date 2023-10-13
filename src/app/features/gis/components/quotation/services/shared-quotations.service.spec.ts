import { TestBed } from '@angular/core/testing';

import { SharedQuotationsService } from './shared-quotations.service';

describe('SharedQuotationsService', () => {
  let service: SharedQuotationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedQuotationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
