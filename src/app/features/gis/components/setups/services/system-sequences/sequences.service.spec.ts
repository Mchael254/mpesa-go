import { TestBed } from '@angular/core/testing';

import { SequencesService } from './sequences.service';

describe('SequencesService', () => {
  let service: SequencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SequencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
