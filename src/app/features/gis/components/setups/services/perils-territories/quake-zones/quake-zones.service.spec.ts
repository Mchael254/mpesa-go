import { TestBed } from '@angular/core/testing';

import { QuakeZonesService } from './quake-zones.service';

describe('QuakeZonesService', () => {
  let service: QuakeZonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuakeZonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
