import { TestBed } from '@angular/core/testing';

import { ReceiptManagementService } from './receipt-management.service';

describe('ReceiptManagementService', () => {
  let service: ReceiptManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
