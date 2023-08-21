import { TestBed } from '@angular/core/testing';

import { TransactionTypesService } from './transaction-types.service';

describe('TransactionTypesService', () => {
  let service: TransactionTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
