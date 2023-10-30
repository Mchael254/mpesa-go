import { TestBed } from '@angular/core/testing';

import { NewBusinessService } from './new-business.service';

describe('NewBusinessService', () => {
  let service: NewBusinessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewBusinessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
