import { TestBed } from '@angular/core/testing';

import { ReceiptAuthorizationService } from './receipt-authorization.service';

describe('ReceiptAuthorizationService', () => {
  let service: ReceiptAuthorizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptAuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});