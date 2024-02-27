import { TestBed } from '@angular/core/testing';

import { IdentityTypeService } from './identity-type.service';

describe('IdentityTypeService', () => {
  let service: IdentityTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentityTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
