import { TestBed } from '@angular/core/testing';

import { FmsService } from './fms.service';

describe('FmsService', () => {
  let service: FmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
