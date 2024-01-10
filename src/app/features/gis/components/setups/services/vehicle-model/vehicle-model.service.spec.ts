import { TestBed } from '@angular/core/testing';

import { VehicleModelService } from './vehicle-model.service';

describe('VehicleModelService', () => {
  let service: VehicleModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
