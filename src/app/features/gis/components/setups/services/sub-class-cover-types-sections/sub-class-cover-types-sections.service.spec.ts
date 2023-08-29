import { TestBed } from '@angular/core/testing';

import { SubClassCoverTypesSectionsService } from './sub-class-cover-types-sections.service';

describe('SubClassCoverTypesSectionsService', () => {
  let service: SubClassCoverTypesSectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubClassCoverTypesSectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
