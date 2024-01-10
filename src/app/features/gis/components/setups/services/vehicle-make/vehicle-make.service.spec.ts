import { TestBed } from '@angular/core/testing';

import { VehicleMakeService } from './vehicle-make.service';

describe('VehicleMakeService', () => {
  let service: VehicleMakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleMakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
