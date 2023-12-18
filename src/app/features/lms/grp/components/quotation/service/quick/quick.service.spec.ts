import { TestBed } from '@angular/core/testing';

import { QuickService } from './quick.service';

describe('QuickService', () => {
  let service: QuickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
