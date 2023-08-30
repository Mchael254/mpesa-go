import { TestBed } from '@angular/core/testing';

import { SubclassesService } from './subclasses.service';

describe('SubclassesService', () => {
  let service: SubclassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubclassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
