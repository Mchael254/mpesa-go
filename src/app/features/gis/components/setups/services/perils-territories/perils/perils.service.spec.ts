import { TestBed } from '@angular/core/testing';

import { PerilsService } from './perils.service';

describe('PerilsService', () => {
  let service: PerilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
