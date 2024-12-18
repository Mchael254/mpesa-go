import { TestBed } from '@angular/core/testing';

import { VesselTypesService } from '../vessel-types/vessel-types.service';

describe('VesselTypesService', () => {
  let service: VesselTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VesselTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
