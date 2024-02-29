import { TestBed } from '@angular/core/testing';

import { CompletionRemarksService } from './completion-remarks.service';

describe('CompletionRemarksService', () => {
  let service: CompletionRemarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompletionRemarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
