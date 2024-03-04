import { TestBed } from '@angular/core/testing';

import { RiskClausesService } from './risk-clauses.service';

describe('RiskClausesService', () => {
  let service: RiskClausesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskClausesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
