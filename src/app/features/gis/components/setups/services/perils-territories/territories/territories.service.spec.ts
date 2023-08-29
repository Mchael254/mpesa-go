import { TestBed } from '@angular/core/testing';

import { TerritoriesService } from './territories.service';

describe('TerritoriesService', () => {
  let service: TerritoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerritoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
