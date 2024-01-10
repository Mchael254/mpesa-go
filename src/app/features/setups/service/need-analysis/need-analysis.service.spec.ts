import { TestBed } from '@angular/core/testing';

import { NeedAnalysisService } from './need-analysis.service';

describe('NeedAnalysisService', () => {
  let service: NeedAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeedAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
