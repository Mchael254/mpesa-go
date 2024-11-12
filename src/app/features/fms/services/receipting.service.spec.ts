import { TestBed } from '@angular/core/testing';

import { ReceiptingService } from './receipting.service';

describe('ReceiptingService', () => {
  let service: ReceiptingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
