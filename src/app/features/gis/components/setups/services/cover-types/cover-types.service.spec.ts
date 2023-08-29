import { TestBed } from '@angular/core/testing';

import { CoverTypesService } from './cover-types.service';

describe('CoverTypesService', () => {
  let service: CoverTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
