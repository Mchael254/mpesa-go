import { TestBed } from '@angular/core/testing';

import { ContractNamesService } from './contract-names.service';

describe('ContractNamesService', () => {
  let service: ContractNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
