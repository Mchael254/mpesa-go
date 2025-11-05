import { TestBed } from '@angular/core/testing';

import { EntityUtilService } from './entity-util.service';

describe('EntityUtilService', () => {
  let service: EntityUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
