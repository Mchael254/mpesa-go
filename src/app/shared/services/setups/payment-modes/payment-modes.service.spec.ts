import { TestBed } from '@angular/core/testing';

import { PaymentModesService } from './payment-modes.service';

describe('PaymentModesService', () => {
  let service: PaymentModesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentModesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
