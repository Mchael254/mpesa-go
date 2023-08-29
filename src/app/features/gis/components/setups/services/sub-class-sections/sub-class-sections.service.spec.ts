import { TestBed } from '@angular/core/testing';

import { SubClassSectionsService } from './sub-class-sections.service';

describe('SubClassSectionsService', () => {
  let service: SubClassSectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubClassSectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
