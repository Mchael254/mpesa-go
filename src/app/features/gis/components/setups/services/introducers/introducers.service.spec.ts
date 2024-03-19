import { TestBed } from '@angular/core/testing';

import { IntroducersService } from './introducers.service';

describe('IntroducersService', () => {
  let service: IntroducersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroducersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
