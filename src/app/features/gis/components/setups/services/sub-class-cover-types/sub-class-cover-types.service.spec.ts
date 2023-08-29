import { TestBed } from '@angular/core/testing';

import { SubClassCoverTypesService } from './sub-class-cover-types.service';

describe('SubClassCoverTypesService', () => {
  let service: SubClassCoverTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubClassCoverTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
