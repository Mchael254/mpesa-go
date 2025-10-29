import { TestBed } from '@angular/core/testing';

import { BankingProcessService } from './banking-process.service';

describe('BankingProcessService', () => {
  let service: BankingProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankingProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
