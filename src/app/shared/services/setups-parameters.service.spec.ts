import { TestBed } from '@angular/core/testing';

import { SetupsParametersService } from './setups-parameters.service';

describe('SetupsParametersService', () => {
  let service: SetupsParametersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetupsParametersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
