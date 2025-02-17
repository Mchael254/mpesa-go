import { TestBed } from '@angular/core/testing';

import { ReceiptDataService } from './receipt-data.service';

describe('ReceiptDataService', () => {
  let service: ReceiptDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
