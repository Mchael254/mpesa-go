import { TestBed } from '@angular/core/testing';

import { DmsService } from './dms.service';

describe('DmsService', () => {
  let service: DmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
