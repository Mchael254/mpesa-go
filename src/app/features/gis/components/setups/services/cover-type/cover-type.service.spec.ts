import { TestBed } from '@angular/core/testing';

import { CoverTypeService } from './cover-type.service';

describe('CoverTypeService', () => {
  let service: CoverTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
