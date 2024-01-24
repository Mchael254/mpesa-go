import { TestBed } from '@angular/core/testing';

import { BankChargeRateTypesService } from './bank-charge-rate-types.service';

describe('BankChargeRateTypesService', () => {
  let service: BankChargeRateTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankChargeRateTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
