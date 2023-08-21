import { TestBed } from '@angular/core/testing';

import { ClauseService } from './clause.service';

describe('ClauseService', () => {
  let service: ClauseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClauseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
