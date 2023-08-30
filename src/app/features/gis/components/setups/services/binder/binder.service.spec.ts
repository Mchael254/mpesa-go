import { TestBed } from '@angular/core/testing';

import { BinderService } from './binder.service';

describe('BinderService', () => {
  let service: BinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
