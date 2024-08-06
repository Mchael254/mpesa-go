import { TestBed } from '@angular/core/testing';

import { JobTypesService } from './job-types.service';

describe('JobTypesService', () => {
  let service: JobTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
