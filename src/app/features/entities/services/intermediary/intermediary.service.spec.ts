import { TestBed } from '@angular/core/testing';

import { IntermediaryService } from './intermediary.service';

describe('IntermediaryService', () => {
  let service: IntermediaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntermediaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
