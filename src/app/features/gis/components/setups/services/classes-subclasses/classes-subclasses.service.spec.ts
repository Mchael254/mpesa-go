import { TestBed } from '@angular/core/testing';

import { ClassesSubclassesService } from './classes-subclasses.service';

describe('ClassesSubclassesService', () => {
  let service: ClassesSubclassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassesSubclassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
